-- Drop tables if they exist (to avoid conflicts when re-running)
DROP TABLE IF EXISTS `responses`;
DROP TABLE IF EXISTS `survey_user_status`;
DROP TABLE IF EXISTS `questions`;
DROP TABLE IF EXISTS `surveys`;
DROP TABLE IF EXISTS `users`;

-- ========================
-- Users
-- ========================
CREATE TABLE `users` (
  `id` VARCHAR(36) NOT NULL,
  `name` VARCHAR(255),
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255),
  `role` ENUM('user', 'admin') DEFAULT 'user',
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================
-- Surveys
-- ========================
CREATE TABLE `surveys` (
  `id` VARCHAR(36) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `createdBy` VARCHAR(36) NOT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_survey_user`
    FOREIGN KEY (`createdBy`) REFERENCES `users` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================
-- Questions
-- ========================
CREATE TABLE `questions` (
  `id` VARCHAR(36) NOT NULL,
  `text` VARCHAR(255) NOT NULL,
  `type` ENUM('text', 'multiple-choice', 'checkbox', 'rating', 'boolean') NOT NULL,
  `options` JSON NULL,
  `surveyId` VARCHAR(36) NOT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_question_survey`
    FOREIGN KEY (`surveyId`) REFERENCES `surveys` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================
-- Responses
-- ========================
CREATE TABLE `responses` (
  `id` VARCHAR(36) NOT NULL,
  `answer` VARCHAR(255) NOT NULL,
  `questionId` VARCHAR(36) NOT NULL,
  `surveyId` VARCHAR(36) NOT NULL,
  `userId` VARCHAR(36) NOT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_response_question`
    FOREIGN KEY (`questionId`) REFERENCES `questions` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_response_survey`
    FOREIGN KEY (`surveyId`) REFERENCES `surveys` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_response_user`
    FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `unique_response_per_user`
    UNIQUE (`surveyId`, `questionId`, `userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================
-- Survey User Status
-- ========================
CREATE TABLE `survey_user_status` (
  `id` VARCHAR(36) NOT NULL,
  `userId` VARCHAR(36) NOT NULL,
  `surveyId` VARCHAR(36) NOT NULL,
  `status` ENUM('new', 'in_progress', 'completed') NOT NULL DEFAULT 'new',
  `answers` JSON NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_sus_user`
    FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_sus_survey`
    FOREIGN KEY (`surveyId`) REFERENCES `surveys` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  UNIQUE KEY `unique_user_survey` (`userId`, `surveyId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================
-- Seed Data
-- ========================

-- Users
INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`)
VALUES 
  ('u1', 'Alice Admin', 'alice@example.com', 'hashed_pw_1', 'admin'),
  ('u2', 'Bob User', 'bob@example.com', 'hashed_pw_2', 'user'),
  ('u3', 'Charlie User', 'charlie@example.com', 'hashed_pw_3', 'user');

-- Surveys
INSERT INTO `surveys` (`id`, `title`, `description`, `createdBy`)
VALUES 
  ('s1', 'Customer Satisfaction Survey', 'We value your feedback about our service.', 'u1'),
  ('s2', 'Product Feedback Survey', 'Help us improve our products.', 'u1');

-- Questions
INSERT INTO `questions` (`id`, `text`, `type`, `options`, `surveyId`)
VALUES 
  ('q1', 'How satisfied are you with our service?', 'rating', JSON_ARRAY('1','2','3','4','5'), 's1'),
  ('q2', 'Would you recommend us to a friend?', 'boolean', NULL, 's1'),
  ('q3', 'Which features do you use the most?', 'multiple-choice', JSON_ARRAY('Feature A','Feature B','Feature C'), 's2');

-- Responses
INSERT INTO `responses` (`id`, `answer`, `questionId`, `surveyId`, `userId`)
VALUES 
  ('r1', '5', 'q1', 's1', 'u2'),
  ('r2', 'yes', 'q2', 's1', 'u2'),
  ('r3', 'Feature A', 'q3', 's2', 'u3');

-- Survey User Status
INSERT INTO `survey_user_status` (`id`, `userId`, `surveyId`, `status`, `answers`)
VALUES 
  ('sus1', 'u2', 's1', 'completed', JSON_OBJECT('q1', '5', 'q2', 'yes')),
  ('sus2', 'u3', 's2', 'in_progress', JSON_OBJECT('q3', 'Feature A'));
