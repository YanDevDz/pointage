-- phpMyAdmin SQL Dump
-- version 4.6.4
-- https://www.phpmyadmin.net/
--
-- Client :  127.0.0.1
-- Généré le :  Sam 02 Octobre 2021 à 18:30
-- Version du serveur :  5.7.14
-- Version de PHP :  5.6.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `pointage`
--
CREATE DATABASE IF NOT EXISTS `pointage` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `pointage`;

-- --------------------------------------------------------

--
-- Structure de la table `employees`
--

CREATE TABLE `employees` (
  `id` varchar(8) NOT NULL COMMENT 'c''est ID de l''employé. String comme voulue',
  `name` varchar(20) NOT NULL,
  `firstName` varchar(20) NOT NULL,
  `dateCreated` date NOT NULL,
  `department` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `employees`
--

INSERT INTO `employees` (`id`, `name`, `firstName`, `dateCreated`, `department`) VALUES
('ku9trsir', 'benslimane', 'yanis', '2021-10-02', 'info');

-- --------------------------------------------------------

--
-- Structure de la table `pointages`
--

CREATE TABLE `pointages` (
  `id` int(10) UNSIGNED NOT NULL,
  `fk_id_employee` varchar(8) NOT NULL COMMENT 'clé étrangere vers id_employee',
  `checkin` datetime DEFAULT NULL COMMENT 'type datetime pour garder lheure aussi',
  `checkout` datetime DEFAULT NULL,
  `hours_worked` time DEFAULT NULL COMMENT 'heures qu''il a travailler a la journée',
  `commentaire` varchar(250) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `pointages`
--

INSERT INTO `pointages` (`id`, `fk_id_employee`, `checkin`, `checkout`, `hours_worked`, `commentaire`) VALUES
(6, 'ku9trsir', '2021-10-02 14:28:32', '2021-10-02 14:28:32', '00:00:00', 'just a comment !');

--
-- Index pour les tables exportées
--

--
-- Index pour la table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `pointages`
--
ALTER TABLE `pointages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_id_employee` (`fk_id_employee`);

--
-- AUTO_INCREMENT pour les tables exportées
--

--
-- AUTO_INCREMENT pour la table `pointages`
--
ALTER TABLE `pointages`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
--
-- Contraintes pour les tables exportées
--

--
-- Contraintes pour la table `pointages`
--
ALTER TABLE `pointages`
  ADD CONSTRAINT `fk_to_id_employee` FOREIGN KEY (`fk_id_employee`) REFERENCES `employees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
