CREATE DATABASE APP_DB;

USE `app_db`;

/*Table structure for table `project_info` */

DROP TABLE IF EXISTS `project_info`;

CREATE TABLE `project_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_title` varchar(60) DEFAULT NULL,
  `project_start_date` varchar(20) DEFAULT NULL,
  `project_end_date` varchar(20) DEFAULT NULL,
  `project_status` varchar(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=latin1;

/*Table structure for table `task_details` */

DROP TABLE IF EXISTS `task_details`;

CREATE TABLE `task_details` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `task_id` int(11) DEFAULT NULL,
  `user_name` varchar(30) DEFAULT NULL,
  `task_comments` varchar(300) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=latin1;

/*Table structure for table `task_info` */

DROP TABLE IF EXISTS `task_info`;

CREATE TABLE `task_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(4) NOT NULL,
  `task_title` varchar(60) NOT NULL,
  `task_start_date` varchar(20) DEFAULT NULL,
  `task_end_date` varchar(20) DEFAULT NULL,
  `task_owner` varchar(30) DEFAULT NULL,
  `task_status` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=latin1;

/*Table structure for table `user_info` */

DROP TABLE IF EXISTS `user_info`;

CREATE TABLE `user_info` (
  `id` int(5) NOT NULL AUTO_INCREMENT,
  `email_id` varchar(40) NOT NULL,
  `user_name` varchar(25) NOT NULL,
  `user_pwd` varchar(25) NOT NULL,
  `account_status` varchar(1) NOT NULL,
  `account_creation_date` bigint(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=latin1;
