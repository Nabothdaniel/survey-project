CREATE TABLE responses (
    id CHAR(36) NOT NULL,
    answer TEXT NOT NULL,
    userId CHAR(36) NOT NULL,
    surveyId INT(11) NOT NULL,
    questionId CHAR(36) NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    KEY idx_user (userId),
    KEY idx_survey (surveyId),
    KEY idx_question (questionId),
    CONSTRAINT fk_response_user FOREIGN KEY (userId) 
        REFERENCES users(id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    CONSTRAINT fk_response_survey FOREIGN KEY (surveyId) 
        REFERENCES surveys(id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    CONSTRAINT fk_response_question FOREIGN KEY (questionId) 
        REFERENCES questions(id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_general_ci;
