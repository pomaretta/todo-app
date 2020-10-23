-- CREATING AND USING
CREATE DATABASE todoApp;
USE todoApp;


-- TABLES
CREATE TABLE Users(
    userID INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(50) NOT NULL,
    mail VARCHAR(50) NOT NULL
);

CREATE TABLE Tasks(
    TaskID INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(50) NOT NULL,
    description TEXT(1024) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user INT NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY(user) REFERENCES Users(userID)
);

-- TEST Users
INSERT INTO Users(username,password,mail) VALUES (
    "test", "testing", "test@carlospomares.es"
);