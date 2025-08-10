// controllers/responseController.js
import Response from "../models/Response.js";
import Survey from "../models/Survey.js";
import Question from "../models/Question.js";
import User from "../models/User.js";

export const respondToSurvey = async (req, res) => {
  const t = await Response.sequelize.transaction();
  try {
    const { surveyId, answers } = req.body;
    const userId = req.user.id;

    // Ensure survey exists
    const survey = await Survey.findByPk(surveyId, {
      include: [{ model: Question, as: "questions" }],
    });
    if (!survey) {
      return res.status(404).json({ success: false, message: "Survey not found" });
    }

    // Use upsert for each response
    for (const a of answers) {
      const answerValue = Array.isArray(a.answer) ? JSON.stringify(a.answer) : a.answer;

      await Response.upsert({
        surveyId,
        questionId: a.questionId,
        userId,
        answer: answerValue,
      }, { transaction: t });
    }

    await t.commit();

    // Fetch responses with user and question info
    const savedResponses = await Response.findAll({
      where: { surveyId, userId },
      include: [
        { model: User, as: "respondent", attributes: ["id", "name", "email"] },
        { model: Question, as: "question", attributes: ["id", "text", "type"] },
      ],
    });

    if (!savedResponses.length) {
      return res.status(404).json({ success: false, message: "No responses found" });
    }

    const respondentInfo = {
      id: savedResponses[0].respondent.id,
      name: savedResponses[0].respondent.name,
      email: savedResponses[0].respondent.email,
    };

    const groupedAnswers = savedResponses.map((resp) => ({
      questionId: resp.question.id,
      question: resp.question.text,
      type: resp.question.type,
      answer: resp.answer,
    }));

    res.status(201).json({
      success: true,
      message: "Survey responses submitted successfully",
      respondent: respondentInfo,
      answers: groupedAnswers,
    });

  } catch (err) {
    if (!t.finished) await t.rollback();
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to submit responses" });
  }
};
