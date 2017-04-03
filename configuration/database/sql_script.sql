DROP TABLE User_Project;
DROP TABLE User;
DROP TABLE Project;

CREATE TABLE User (
	id INT(10) AUTO_INCREMENT,
	email_address VARCHAR(50),
	display_name VARCHAR(50),
	google_profile_image_url TEXT,
	google_profile_id VARBINARY(70),
	google_access_token VARBINARY(2400),
	google_refresh_token VARBINARY(100),
	cd_user_auth_token VARBINARY(100),
	CONSTRAINT user_pk PRIMARY KEY(id)
);

CREATE TABLE Project (
	id INT(10) AUTO_INCREMENT,
	project_name VARCHAR(40) NOT NULL,
	media_folder_id VARBINARY(70),
	access_levels TEXT NOT NULL,
	max_cache_age INT(20) DEFAULT 0,
	custom_css TEXT,
	update_origins TEXT,
	read_origins TEXT,
	CONSTRAINT project_pk PRIMARY KEY(id)
);

CREATE TABLE User_Project (
	id INT(10) AUTO_INCREMENT,
	project_id INT(10) NOT NULL,
	user_id INT(10) NOT NULL,
	access_level_int INT(3) NOT NULL,
	media_folder_permission_id VARBINARY(70),
	public_auth_token VARBINARY(100),
	CONSTRAINT userproject_project_fk FOREIGN KEY(project_id) REFERENCES Project(id),
	CONSTRAINT userproject_user_fk FOREIGN KEY(user_id) REFERENCES User(id),
	CONSTRAINT userproject_pk PRIMARY KEY(id)
);

SELECT * FROM User;
SELECT * FROM User_Project;
SELECT * FROM Project;