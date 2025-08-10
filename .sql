CREATE TABLE `users` (
  `id` CHAR(36) NOT NULL,
  `name` VARCHAR(255),
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255),
  `role` ENUM('user', 'admin') DEFAULT 'user',
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `surveys` (
  `id` CHAR(36) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `createdBy` CHAR(36) NOT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_survey_user`
    FOREIGN KEY (`createdBy`) REFERENCES `users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE `questions` (
  `id` CHAR(36) NOT NULL,
  `text` VARCHAR(255) NOT NULL,
  `type` ENUM('text', 'multiple-choice', 'checkbox', 'rating', 'boolean') NOT NULL,
  `options` JSON NULL,
  `surveyId` CHAR(36) NOT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_question_survey`
    FOREIGN KEY (`surveyId`) REFERENCES `surveys` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



CREATE TABLE `responses` (
  `id` CHAR(36) NOT NULL,
  `answer` VARCHAR(255) NOT NULL,
  `questionId` CHAR(36) NOT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_response_question`
    FOREIGN KEY (`questionId`) REFERENCES `questions` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--the responses was altered

ALTER TABLE responses 
ADD COLUMN surveyId CHAR(36) NOT NULL AFTER questionId,
ADD CONSTRAINT fk_response_survey 
    FOREIGN KEY (surveyId) REFERENCES surveys(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE;

ALTER TABLE responses
ADD CONSTRAINT unique_response_per_user
UNIQUE (surveyId, questionId, userId);

CREATE TABLE SurveyStatuses (
  id CHAR(36) NOT NULL PRIMARY KEY,
  userId CHAR(36) NOT NULL,
  surveyId CHAR(36) NOT NULL,
  status ENUM('new', 'in-progress', 'completed') NOT NULL DEFAULT 'new',
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_user FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_survey FOREIGN KEY (surveyId) REFERENCES surveys(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_survey (userId, surveyId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


