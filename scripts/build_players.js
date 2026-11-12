import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rawTeams = [
  // ==========================================
  // PREMIER LEAGUE (7 teams)
  // ==========================================
  {
    league: 'Premier League',
    team: 'Arsenal',
    players: [
      { name: 'David Raya', ovr: 85, line: 'GK', pos: 'GK', age: 29, nat: 'Spain', val: 45 },
      { name: 'William Saliba', ovr: 88, line: 'DEF', pos: 'CB', age: 24, nat: 'France', val: 85 },
      { name: 'Gabriel Magalhaes', ovr: 86, line: 'DEF', pos: 'CB', age: 27, nat: 'Brazil', val: 75 },
      { name: 'Ben White', ovr: 84, line: 'DEF', pos: 'RB', age: 27, nat: 'England', val: 55 },
      { name: 'Jurrien Timber', ovr: 82, line: 'DEF', pos: 'LB', age: 23, nat: 'Netherlands', val: 45 },
      { name: 'Martin Odegaard', ovr: 89, line: 'MID', pos: 'CAM', age: 26, nat: 'Norway', val: 110 },
      { name: 'Declan Rice', ovr: 88, line: 'MID', pos: 'CDM', age: 26, nat: 'England', val: 115 },
      { name: 'Mikel Merino', ovr: 83, line: 'MID', pos: 'CM', age: 28, nat: 'Spain', val: 50 },
      { name: 'Thomas Partey', ovr: 81, line: 'MID', pos: 'CDM', age: 31, nat: 'Ghana', val: 18 },
      { name: 'Bukayo Saka', ovr: 90, line: 'FWD', pos: 'RW', age: 23, nat: 'England', val: 140 },
      { name: 'Kai Havertz', ovr: 84, line: 'FWD', pos: 'ST', age: 25, nat: 'Germany', val: 70 },
      { name: 'Gabriel Martinelli', ovr: 84, line: 'FWD', pos: 'LW', age: 23, nat: 'Brazil', val: 65 },
      { name: 'Leandro Trossard', ovr: 82, line: 'FWD', pos: 'LW', age: 30, nat: 'Belgium', val: 35 },
    ]
  },
  {
    league: 'Premier League',
    team: 'Man City',
    players: [
      { name: 'Ederson', ovr: 87, line: 'GK', pos: 'GK', age: 31, nat: 'Brazil', val: 35 },
      { name: 'Ruben Dias', ovr: 88, line: 'DEF', pos: 'CB', age: 27, nat: 'Portugal', val: 80 },
      { name: 'Josko Gvardiol', ovr: 86, line: 'DEF', pos: 'LB', age: 23, nat: 'Croatia', val: 75 },
      { name: 'Manuel Akanji', ovr: 84, line: 'DEF', pos: 'CB', age: 29, nat: 'Switzerland', val: 45 },
      { name: 'Kyle Walker', ovr: 81, line: 'DEF', pos: 'RB', age: 34, nat: 'England', val: 12 },
      { name: 'Rodri', ovr: 92, line: 'MID', pos: 'CDM', age: 28, nat: 'Spain', val: 130 },
      { name: 'Kevin De Bruyne', ovr: 91, line: 'MID', pos: 'CAM', age: 33, nat: 'Belgium', val: 50 },
      { name: 'Bernardo Silva', ovr: 88, line: 'MID', pos: 'CM', age: 30, nat: 'Portugal', val: 70 },
      { name: 'Phil Foden', ovr: 90, line: 'MID', pos: 'CAM', age: 24, nat: 'England', val: 150 },
      { name: 'Mateo Kovacic', ovr: 83, line: 'MID', pos: 'CM', age: 30, nat: 'Croatia', val: 30 },
      { name: 'Erling Haaland', ovr: 93, line: 'FWD', pos: 'ST', age: 24, nat: 'Norway', val: 180 },
      { name: 'Jeremy Doku', ovr: 83, line: 'FWD', pos: 'LW', age: 22, nat: 'Belgium', val: 65 },
      { name: 'Savinho', ovr: 82, line: 'FWD', pos: 'RW', age: 20, nat: 'Brazil', val: 50 },
    ]
  },
  {
    league: 'Premier League',
    team: 'Liverpool',
    players: [
      { name: 'Alisson Becker', ovr: 88, line: 'GK', pos: 'GK', age: 32, nat: 'Brazil', val: 30 },
      { name: 'Virgil van Dijk', ovr: 90, line: 'DEF', pos: 'CB', age: 33, nat: 'Netherlands', val: 35 },
      { name: 'Ibrahima Konate', ovr: 85, line: 'DEF', pos: 'CB', age: 25, nat: 'France', val: 55 },
      { name: 'Trent Alexander-Arnold', ovr: 88, line: 'DEF', pos: 'RB', age: 26, nat: 'England', val: 75 },
      { name: 'Andy Robertson', ovr: 84, line: 'DEF', pos: 'LB', age: 30, nat: 'Scotland', val: 30 },
      { name: 'Alexis Mac Allister', ovr: 86, line: 'MID', pos: 'CM', age: 26, nat: 'Argentina', val: 75 },
      { name: 'Dominik Szoboszlai', ovr: 84, line: 'MID', pos: 'CM', age: 24, nat: 'Hungary', val: 75 },
      { name: 'Ryan Gravenberch', ovr: 83, line: 'MID', pos: 'CDM', age: 22, nat: 'Netherlands', val: 45 },
      { name: 'Curtis Jones', ovr: 81, line: 'MID', pos: 'CM', age: 24, nat: 'England', val: 35 },
      { name: 'Mohamed Salah', ovr: 91, line: 'FWD', pos: 'RW', age: 32, nat: 'Egypt', val: 55 },
      { name: 'Luis Diaz', ovr: 85, line: 'FWD', pos: 'LW', age: 28, nat: 'Colombia', val: 80 },
      { name: 'Cody Gakpo', ovr: 83, line: 'FWD', pos: 'LW', age: 25, nat: 'Netherlands', val: 55 },
      { name: 'Darwin Nunez', ovr: 83, line: 'FWD', pos: 'ST', age: 25, nat: 'Uruguay', val: 65 },
    ]
  },
  {
    league: 'Premier League',
    team: 'Chelsea',
    players: [
      { name: 'Robert Sanchez', ovr: 80, line: 'GK', pos: 'GK', age: 27, nat: 'Spain', val: 20 },
      { name: 'Levi Colwill', ovr: 82, line: 'DEF', pos: 'CB', age: 22, nat: 'England', val: 50 },
      { name: 'Wesley Fofana', ovr: 80, line: 'DEF', pos: 'CB', age: 24, nat: 'France', val: 30 },
      { name: 'Marc Cucurella', ovr: 81, line: 'DEF', pos: 'LB', age: 26, nat: 'Spain', val: 30 },
      { name: 'Reece James', ovr: 83, line: 'DEF', pos: 'RB', age: 25, nat: 'England', val: 35 },
      { name: 'Moises Caicedo', ovr: 85, line: 'MID', pos: 'CDM', age: 23, nat: 'Ecuador', val: 80 },
      { name: 'Enzo Fernandez', ovr: 84, line: 'MID', pos: 'CM', age: 24, nat: 'Argentina', val: 75 },
      { name: 'Cole Palmer', ovr: 89, line: 'MID', pos: 'CAM', age: 22, nat: 'England', val: 120 },
      { name: 'Romeo Lavia', ovr: 79, line: 'MID', pos: 'CDM', age: 21, nat: 'Belgium', val: 35 },
      { name: 'Nicolas Jackson', ovr: 82, line: 'FWD', pos: 'ST', age: 23, nat: 'Senegal', val: 50 },
      { name: 'Pedro Neto', ovr: 82, line: 'FWD', pos: 'RW', age: 24, nat: 'Portugal', val: 55 },
      { name: 'Noni Madueke', ovr: 80, line: 'FWD', pos: 'RW', age: 22, nat: 'England', val: 40 },
      { name: 'Christopher Nkunku', ovr: 84, line: 'FWD', pos: 'ST', age: 27, nat: 'France', val: 65 },
    ]
  },
  {
    league: 'Premier League',
    team: 'Man United',
    players: [
      { name: 'Andre Onana', ovr: 83, line: 'GK', pos: 'GK', age: 28, nat: 'Cameroon', val: 35 },
      { name: 'Matthijs de Ligt', ovr: 84, line: 'DEF', pos: 'CB', age: 25, nat: 'Netherlands', val: 55 },
      { name: 'Lisandro Martinez', ovr: 84, line: 'DEF', pos: 'CB', age: 27, nat: 'Argentina', val: 50 },
      { name: 'Diogo Dalot', ovr: 82, line: 'DEF', pos: 'RB', age: 25, nat: 'Portugal', val: 40 },
      { name: 'Noussair Mazraoui', ovr: 81, line: 'DEF', pos: 'LB', age: 27, nat: 'Morocco', val: 30 },
      { name: 'Bruno Fernandes', ovr: 87, line: 'MID', pos: 'CAM', age: 30, nat: 'Portugal', val: 65 },
      { name: 'Kobbie Mainoo', ovr: 82, line: 'MID', pos: 'CM', age: 19, nat: 'England', val: 55 },
      { name: 'Manuel Ugarte', ovr: 82, line: 'MID', pos: 'CDM', age: 23, nat: 'Uruguay', val: 50 },
      { name: 'Casemiro', ovr: 82, line: 'MID', pos: 'CDM', age: 32, nat: 'Brazil', val: 15 },
      { name: 'Marcus Rashford', ovr: 82, line: 'FWD', pos: 'LW', age: 27, nat: 'England', val: 55 },
      { name: 'Alejandro Garnacho', ovr: 82, line: 'FWD', pos: 'LW', age: 20, nat: 'Argentina', val: 50 },
      { name: 'Rasmus Hojlund', ovr: 81, line: 'FWD', pos: 'ST', age: 22, nat: 'Denmark', val: 65 },
      { name: 'Joshua Zirkzee', ovr: 80, line: 'FWD', pos: 'ST', age: 23, nat: 'Netherlands', val: 50 },
    ]
  },
  {
    league: 'Premier League',
    team: 'Tottenham',
    players: [
      { name: 'Guglielmo Vicario', ovr: 83, line: 'GK', pos: 'GK', age: 28, nat: 'Italy', val: 35 },
      { name: 'Cristian Romero', ovr: 85, line: 'DEF', pos: 'CB', age: 26, nat: 'Argentina', val: 65 },
      { name: 'Micky van de Ven', ovr: 84, line: 'DEF', pos: 'CB', age: 23, nat: 'Netherlands', val: 55 },
      { name: 'Pedro Porro', ovr: 83, line: 'DEF', pos: 'RB', age: 25, nat: 'Spain', val: 45 },
      { name: 'Destiny Udogie', ovr: 82, line: 'DEF', pos: 'LB', age: 22, nat: 'Italy', val: 45 },
      { name: 'James Maddison', ovr: 85, line: 'MID', pos: 'CAM', age: 28, nat: 'England', val: 70 },
      { name: 'Dejan Kulusevski', ovr: 84, line: 'MID', pos: 'CM', age: 24, nat: 'Sweden', val: 55 },
      { name: 'Yves Bissouma', ovr: 81, line: 'MID', pos: 'CDM', age: 28, nat: 'Mali', val: 35 },
      { name: 'Pape Matar Sarr', ovr: 80, line: 'MID', pos: 'CM', age: 22, nat: 'Senegal', val: 40 },
      { name: 'Heung-min Son', ovr: 88, line: 'FWD', pos: 'LW', age: 32, nat: 'South Korea', val: 45 },
      { name: 'Dominic Solanke', ovr: 82, line: 'FWD', pos: 'ST', age: 27, nat: 'England', val: 45 },
      { name: 'Brennan Johnson', ovr: 81, line: 'FWD', pos: 'RW', age: 23, nat: 'Wales', val: 48 },
      { name: 'Richarlison', ovr: 81, line: 'FWD', pos: 'ST', age: 27, nat: 'Brazil', val: 38 },
    ]
  },
  {
    league: 'Premier League',
    team: 'Newcastle',
    players: [
      { name: 'Nick Pope', ovr: 82, line: 'GK', pos: 'GK', age: 32, nat: 'England', val: 16 },
      { name: 'Sven Botman', ovr: 83, line: 'DEF', pos: 'CB', age: 25, nat: 'Netherlands', val: 45 },
      { name: 'Fabian Schar', ovr: 81, line: 'DEF', pos: 'CB', age: 33, nat: 'Switzerland', val: 10 },
      { name: 'Kieran Trippier', ovr: 82, line: 'DEF', pos: 'RB', age: 34, nat: 'England', val: 10 },
      { name: 'Lewis Hall', ovr: 79, line: 'DEF', pos: 'LB', age: 20, nat: 'England', val: 25 },
      { name: 'Bruno Guimaraes', ovr: 87, line: 'MID', pos: 'CM', age: 27, nat: 'Brazil', val: 85 },
      { name: 'Sandro Tonali', ovr: 84, line: 'MID', pos: 'CM', age: 24, nat: 'Italy', val: 60 },
      { name: 'Joelinton', ovr: 82, line: 'MID', pos: 'CM', age: 28, nat: 'Brazil', val: 40 },
      { name: 'Joe Willock', ovr: 78, line: 'MID', pos: 'CM', age: 25, nat: 'England', val: 25 },
      { name: 'Alexander Isak', ovr: 87, line: 'FWD', pos: 'ST', age: 25, nat: 'Sweden', val: 85 },
      { name: 'Anthony Gordon', ovr: 84, line: 'FWD', pos: 'LW', age: 23, nat: 'England', val: 60 },
      { name: 'Harvey Barnes', ovr: 81, line: 'FWD', pos: 'LW', age: 27, nat: 'England', val: 35 },
      { name: 'Callum Wilson', ovr: 79, line: 'FWD', pos: 'ST', age: 32, nat: 'England', val: 12 },
    ]
  },

  // ==========================================
  // LA LIGA (7 teams)
  // ==========================================
  {
    league: 'La Liga',
    team: 'Real Madrid',
    players: [
      { name: 'Thibaut Courtois', ovr: 89, line: 'GK', pos: 'GK', age: 32, nat: 'Belgium', val: 28 },
      { name: 'Antonio Rudiger', ovr: 87, line: 'DEF', pos: 'CB', age: 31, nat: 'Germany', val: 25 },
      { name: 'Eder Militao', ovr: 86, line: 'DEF', pos: 'CB', age: 27, nat: 'Brazil', val: 60 },
      { name: 'Dani Carvajal', ovr: 86, line: 'DEF', pos: 'RB', age: 33, nat: 'Spain', val: 12 },
      { name: 'Ferland Mendy', ovr: 82, line: 'DEF', pos: 'LB', age: 29, nat: 'France', val: 22 },
      { name: 'Jude Bellingham', ovr: 92, line: 'MID', pos: 'CAM', age: 21, nat: 'England', val: 180 },
      { name: 'Federico Valverde', ovr: 89, line: 'MID', pos: 'CM', age: 26, nat: 'Uruguay', val: 130 },
      { name: 'Aurelien Tchouameni', ovr: 87, line: 'MID', pos: 'CDM', age: 25, nat: 'France', val: 100 },
      { name: 'Eduardo Camavinga', ovr: 86, line: 'MID', pos: 'CM', age: 22, nat: 'France', val: 100 },
      { name: 'Luka Modric', ovr: 85, line: 'MID', pos: 'CM', age: 39, nat: 'Croatia', val: 6 },
      { name: 'Kylian Mbappe', ovr: 93, line: 'FWD', pos: 'ST', age: 26, nat: 'France', val: 180 },
      { name: 'Vinicius Jr', ovr: 92, line: 'FWD', pos: 'LW', age: 24, nat: 'Brazil', val: 200 },
      { name: 'Rodrygo', ovr: 87, line: 'FWD', pos: 'RW', age: 24, nat: 'Brazil', val: 110 },
    ]
  },
  {
    league: 'La Liga',
    team: 'Barcelona',
    players: [
      { name: 'Marc-Andre ter Stegen', ovr: 87, line: 'GK', pos: 'GK', age: 32, nat: 'Germany', val: 20 },
      { name: 'Jules Kounde', ovr: 86, line: 'DEF', pos: 'RB', age: 26, nat: 'France', val: 60 },
      { name: 'Ronald Araujo', ovr: 86, line: 'DEF', pos: 'CB', age: 25, nat: 'Uruguay', val: 70 },
      { name: 'Pau Cubarsi', ovr: 82, line: 'DEF', pos: 'CB', age: 18, nat: 'Spain', val: 45 },
      { name: 'Alejandro Balde', ovr: 82, line: 'DEF', pos: 'LB', age: 21, nat: 'Spain', val: 40 },
      { name: 'Pedri', ovr: 89, line: 'MID', pos: 'CM', age: 22, nat: 'Spain', val: 90 },
      { name: 'Gavi', ovr: 86, line: 'MID', pos: 'CM', age: 20, nat: 'Spain', val: 90 },
      { name: 'Frenkie de Jong', ovr: 86, line: 'MID', pos: 'CM', age: 27, nat: 'Netherlands', val: 60 },
      { name: 'Dani Olmo', ovr: 86, line: 'MID', pos: 'CAM', age: 26, nat: 'Spain', val: 60 },
      { name: 'Marc Casado', ovr: 79, line: 'MID', pos: 'CDM', age: 21, nat: 'Spain', val: 25 },
      { name: 'Lamine Yamal', ovr: 89, line: 'FWD', pos: 'RW', age: 17, nat: 'Spain', val: 150 },
      { name: 'Robert Lewandowski', ovr: 88, line: 'FWD', pos: 'ST', age: 36, nat: 'Poland', val: 15 },
      { name: 'Raphinha', ovr: 87, line: 'FWD', pos: 'LW', age: 28, nat: 'Brazil', val: 70 },
    ]
  },
  {
    league: 'La Liga',
    team: 'Atlético Madrid',
    players: [
      { name: 'Jan Oblak', ovr: 88, line: 'GK', pos: 'GK', age: 32, nat: 'Slovenia', val: 28 },
      { name: 'Robin Le Normand', ovr: 84, line: 'DEF', pos: 'CB', age: 28, nat: 'Spain', val: 40 },
      { name: 'Jose Maria Gimenez', ovr: 83, line: 'DEF', pos: 'CB', age: 30, nat: 'Uruguay', val: 22 },
      { name: 'Nahuel Molina', ovr: 81, line: 'DEF', pos: 'RB', age: 27, nat: 'Argentina', val: 28 },
      { name: 'Reinildo Mandava', ovr: 80, line: 'DEF', pos: 'LB', age: 31, nat: 'Mozambique', val: 12 },
      { name: 'Rodrigo De Paul', ovr: 84, line: 'MID', pos: 'CM', age: 30, nat: 'Argentina', val: 30 },
      { name: 'Conor Gallagher', ovr: 83, line: 'MID', pos: 'CM', age: 25, nat: 'England', val: 50 },
      { name: 'Koke', ovr: 82, line: 'MID', pos: 'CM', age: 33, nat: 'Spain', val: 12 },
      { name: 'Marcos Llorente', ovr: 83, line: 'MID', pos: 'CM', age: 30, nat: 'Spain', val: 30 },
      { name: 'Antoine Griezmann', ovr: 88, line: 'FWD', pos: 'ST', age: 33, nat: 'France', val: 25 },
      { name: 'Julian Alvarez', ovr: 88, line: 'FWD', pos: 'ST', age: 25, nat: 'Argentina', val: 90 },
      { name: 'Alexander Sorloth', ovr: 82, line: 'FWD', pos: 'ST', age: 29, nat: 'Norway', val: 25 },
      { name: 'Angel Correa', ovr: 81, line: 'FWD', pos: 'RW', age: 29, nat: 'Argentina', val: 18 },
    ]
  },
  {
    league: 'La Liga',
    team: 'Sevilla',
    players: [
      { name: 'Orjan Nyland', ovr: 77, line: 'GK', pos: 'GK', age: 34, nat: 'Norway', val: 4 },
      { name: 'Loic Bade', ovr: 81, line: 'DEF', pos: 'CB', age: 24, nat: 'France', val: 20 },
      { name: 'Marcao', ovr: 77, line: 'DEF', pos: 'CB', age: 28, nat: 'Brazil', val: 6 },
      { name: 'Adria Pedrosa', ovr: 77, line: 'DEF', pos: 'LB', age: 26, nat: 'Spain', val: 7 },
      { name: 'Juanlu Sanchez', ovr: 78, line: 'DEF', pos: 'RB', age: 21, nat: 'Spain', val: 15 },
      { name: 'Albert Sambi Lokonga', ovr: 77, line: 'MID', pos: 'CM', age: 25, nat: 'Belgium', val: 12 },
      { name: 'Lucien Agoume', ovr: 77, line: 'MID', pos: 'CDM', age: 23, nat: 'France', val: 10 },
      { name: 'Saul Niguez', ovr: 78, line: 'MID', pos: 'CM', age: 30, nat: 'Spain', val: 8 },
      { name: 'Djibril Sow', ovr: 77, line: 'MID', pos: 'CM', age: 28, nat: 'Switzerland', val: 10 },
      { name: 'Dodi Lukebakio', ovr: 80, line: 'FWD', pos: 'RW', age: 27, nat: 'Belgium', val: 15 },
      { name: 'Isaac Romero', ovr: 78, line: 'FWD', pos: 'ST', age: 24, nat: 'Spain', val: 18 },
      { name: 'Chidera Ejuke', ovr: 77, line: 'FWD', pos: 'LW', age: 27, nat: 'Nigeria', val: 8 },
      { name: 'Kelechi Iheanacho', ovr: 76, line: 'FWD', pos: 'ST', age: 28, nat: 'Nigeria', val: 9 },
    ]
  },
  {
    league: 'La Liga',
    team: 'Villarreal',
    players: [
      { name: 'Diego Conde', ovr: 78, line: 'GK', pos: 'GK', age: 26, nat: 'Spain', val: 8 },
      { name: 'Raul Albiol', ovr: 78, line: 'DEF', pos: 'CB', age: 39, nat: 'Spain', val: 3 },
      { name: 'Eric Bailly', ovr: 77, line: 'DEF', pos: 'CB', age: 30, nat: 'Ivory Coast', val: 5 },
      { name: 'Juan Foyth', ovr: 80, line: 'DEF', pos: 'RB', age: 27, nat: 'Argentina', val: 18 },
      { name: 'Sergi Cardona', ovr: 78, line: 'DEF', pos: 'LB', age: 25, nat: 'Spain', val: 10 },
      { name: 'Alex Baena', ovr: 84, line: 'MID', pos: 'CAM', age: 23, nat: 'Spain', val: 50 },
      { name: 'Dani Parejo', ovr: 81, line: 'MID', pos: 'CM', age: 35, nat: 'Spain', val: 4 },
      { name: 'Pape Gueye', ovr: 78, line: 'MID', pos: 'CDM', age: 26, nat: 'Senegal', val: 10 },
      { name: 'Santi Comesana', ovr: 78, line: 'MID', pos: 'CM', age: 28, nat: 'Spain', val: 8 },
      { name: 'Gerard Moreno', ovr: 82, line: 'FWD', pos: 'ST', age: 32, nat: 'Spain', val: 14 },
      { name: 'Ayoze Perez', ovr: 80, line: 'FWD', pos: 'ST', age: 31, nat: 'Spain', val: 10 },
      { name: 'Yeremy Pino', ovr: 80, line: 'FWD', pos: 'LW', age: 22, nat: 'Spain', val: 30 },
      { name: 'Nicolas Pepe', ovr: 79, line: 'FWD', pos: 'RW', age: 29, nat: 'Ivory Coast', val: 12 },
    ]
  },
  {
    league: 'La Liga',
    team: 'Real Sociedad',
    players: [
      { name: 'Alex Remiro', ovr: 83, line: 'GK', pos: 'GK', age: 29, nat: 'Spain', val: 25 },
      { name: 'Igor Zubeldia', ovr: 81, line: 'DEF', pos: 'CB', age: 27, nat: 'Spain', val: 22 },
      { name: 'Nayef Aguerd', ovr: 80, line: 'DEF', pos: 'CB', age: 28, nat: 'Morocco', val: 35 },
      { name: 'Aihen Munoz', ovr: 78, line: 'DEF', pos: 'LB', age: 27, nat: 'Spain', val: 10 },
      { name: 'Jon Aramburu', ovr: 77, line: 'DEF', pos: 'RB', age: 22, nat: 'Venezuela', val: 8 },
      { name: 'Martin Zubimendi', ovr: 86, line: 'MID', pos: 'CDM', age: 26, nat: 'Spain', val: 60 },
      { name: 'Brais Mendez', ovr: 82, line: 'MID', pos: 'CM', age: 28, nat: 'Spain', val: 40 },
      { name: 'Luka Sucic', ovr: 79, line: 'MID', pos: 'CM', age: 22, nat: 'Croatia', val: 20 },
      { name: 'Benat Turrientes', ovr: 78, line: 'MID', pos: 'CM', age: 23, nat: 'Spain', val: 15 },
      { name: 'Takefusa Kubo', ovr: 84, line: 'FWD', pos: 'RW', age: 23, nat: 'Japan', val: 50 },
      { name: 'Mikel Oyarzabal', ovr: 84, line: 'FWD', pos: 'LW', age: 27, nat: 'Spain', val: 40 },
      { name: 'Sheraldo Becker', ovr: 78, line: 'FWD', pos: 'ST', age: 30, nat: 'Suriname', val: 10 },
      { name: 'Orri Oskarsson', ovr: 77, line: 'FWD', pos: 'ST', age: 20, nat: 'Iceland', val: 20 },
    ]
  },
  {
    league: 'La Liga',
    team: 'Real Betis',
    players: [
      { name: 'Rui Silva', ovr: 79, line: 'GK', pos: 'GK', age: 31, nat: 'Portugal', val: 8 },
      { name: 'Marc Bartra', ovr: 78, line: 'DEF', pos: 'CB', age: 34, nat: 'Spain', val: 4 },
      { name: 'Diego Llorente', ovr: 79, line: 'DEF', pos: 'CB', age: 31, nat: 'Spain', val: 7 },
      { name: 'Romain Perraud', ovr: 77, line: 'DEF', pos: 'LB', age: 27, nat: 'France', val: 7 },
      { name: 'Hector Bellerin', ovr: 78, line: 'DEF', pos: 'RB', age: 29, nat: 'Spain', val: 5 },
      { name: 'Isco', ovr: 83, line: 'MID', pos: 'CAM', age: 32, nat: 'Spain', val: 8 },
      { name: 'Giovani Lo Celso', ovr: 82, line: 'MID', pos: 'CM', age: 28, nat: 'Argentina', val: 20 },
      { name: 'Johnny Cardoso', ovr: 79, line: 'MID', pos: 'CDM', age: 23, nat: 'USA', val: 20 },
      { name: 'Marc Roca', ovr: 78, line: 'MID', pos: 'CDM', age: 28, nat: 'Spain', val: 10 },
      { name: 'Vitor Roque', ovr: 79, line: 'FWD', pos: 'ST', age: 20, nat: 'Brazil', val: 30 },
      { name: 'Pablo Fornals', ovr: 79, line: 'FWD', pos: 'RW', age: 28, nat: 'Spain', val: 14 },
      { name: 'Abde Ezzalzouli', ovr: 79, line: 'FWD', pos: 'LW', age: 23, nat: 'Morocco', val: 15 },
      { name: 'Chimy Avila', ovr: 78, line: 'FWD', pos: 'ST', age: 31, nat: 'Argentina', val: 5 },
    ]
  },

  // ==========================================
  // SERIE A (7 teams)
  // ==========================================
  {
    league: 'Serie A',
    team: 'Inter',
    players: [
      { name: 'Yann Sommer', ovr: 86, line: 'GK', pos: 'GK', age: 36, nat: 'Switzerland', val: 5 },
      { name: 'Alessandro Bastoni', ovr: 88, line: 'DEF', pos: 'CB', age: 25, nat: 'Italy', val: 70 },
      { name: 'Benjamin Pavard', ovr: 84, line: 'DEF', pos: 'CB', age: 28, nat: 'France', val: 45 },
      { name: 'Federico Dimarco', ovr: 85, line: 'DEF', pos: 'LB', age: 27, nat: 'Italy', val: 60 },
      { name: 'Denzel Dumfries', ovr: 82, line: 'DEF', pos: 'RB', age: 28, nat: 'Netherlands', val: 25 },
      { name: 'Nicolo Barella', ovr: 88, line: 'MID', pos: 'CM', age: 28, nat: 'Italy', val: 80 },
      { name: 'Hakan Calhanoglu', ovr: 87, line: 'MID', pos: 'CDM', age: 31, nat: 'Turkey', val: 45 },
      { name: 'Henrikh Mkhitaryan', ovr: 83, line: 'MID', pos: 'CM', age: 36, nat: 'Armenia', val: 6 },
      { name: 'Davide Frattesi', ovr: 82, line: 'MID', pos: 'CM', age: 25, nat: 'Italy', val: 35 },
      { name: 'Piotr Zielinski', ovr: 82, line: 'MID', pos: 'CM', age: 30, nat: 'Poland', val: 22 },
      { name: 'Lautaro Martinez', ovr: 90, line: 'FWD', pos: 'ST', age: 27, nat: 'Argentina', val: 110 },
      { name: 'Marcus Thuram', ovr: 85, line: 'FWD', pos: 'ST', age: 27, nat: 'France', val: 65 },
      { name: 'Mehdi Taremi', ovr: 80, line: 'FWD', pos: 'ST', age: 32, nat: 'Iran', val: 10 },
    ]
  },
  {
    league: 'Serie A',
    team: 'Milan',
    players: [
      { name: 'Mike Maignan', ovr: 87, line: 'GK', pos: 'GK', age: 29, nat: 'France', val: 38 },
      { name: 'Theo Hernandez', ovr: 87, line: 'DEF', pos: 'LB', age: 27, nat: 'France', val: 60 },
      { name: 'Fikayo Tomori', ovr: 83, line: 'DEF', pos: 'CB', age: 27, nat: 'England', val: 32 },
      { name: 'Strahinja Pavlovic', ovr: 80, line: 'DEF', pos: 'CB', age: 23, nat: 'Serbia', val: 25 },
      { name: 'Emerson Royal', ovr: 78, line: 'DEF', pos: 'RB', age: 26, nat: 'Brazil', val: 15 },
      { name: 'Tijjani Reijnders', ovr: 83, line: 'MID', pos: 'CM', age: 26, nat: 'Netherlands', val: 35 },
      { name: 'Ruben Loftus-Cheek', ovr: 81, line: 'MID', pos: 'CM', age: 29, nat: 'England', val: 25 },
      { name: 'Youssouf Fofana', ovr: 81, line: 'MID', pos: 'CDM', age: 26, nat: 'France', val: 30 },
      { name: 'Yunus Musah', ovr: 78, line: 'MID', pos: 'CM', age: 22, nat: 'USA', val: 22 },
      { name: 'Rafael Leao', ovr: 88, line: 'FWD', pos: 'LW', age: 25, nat: 'Portugal', val: 90 },
      { name: 'Christian Pulisic', ovr: 84, line: 'FWD', pos: 'RW', age: 26, nat: 'USA', val: 50 },
      { name: 'Alvaro Morata', ovr: 83, line: 'FWD', pos: 'ST', age: 32, nat: 'Spain', val: 16 },
      { name: 'Samuel Chukwueze', ovr: 79, line: 'FWD', pos: 'RW', age: 25, nat: 'Nigeria', val: 20 },
    ]
  },
  {
    league: 'Serie A',
    team: 'Juventus',
    players: [
      { name: 'Michele Di Gregorio', ovr: 82, line: 'GK', pos: 'GK', age: 27, nat: 'Italy', val: 18 },
      { name: 'Bremer', ovr: 86, line: 'DEF', pos: 'CB', age: 27, nat: 'Brazil', val: 60 },
      { name: 'Federico Gatti', ovr: 81, line: 'DEF', pos: 'CB', age: 26, nat: 'Italy', val: 25 },
      { name: 'Pierre Kalulu', ovr: 80, line: 'DEF', pos: 'RB', age: 24, nat: 'France', val: 20 },
      { name: 'Andrea Cambiaso', ovr: 82, line: 'DEF', pos: 'LB', age: 25, nat: 'Italy', val: 35 },
      { name: 'Teun Koopmeiners', ovr: 85, line: 'MID', pos: 'CAM', age: 27, nat: 'Netherlands', val: 55 },
      { name: 'Douglas Luiz', ovr: 84, line: 'MID', pos: 'CM', age: 26, nat: 'Brazil', val: 55 },
      { name: 'Manuel Locatelli', ovr: 82, line: 'MID', pos: 'CDM', age: 27, nat: 'Italy', val: 28 },
      { name: 'Khephren Thuram', ovr: 81, line: 'MID', pos: 'CM', age: 23, nat: 'France', val: 35 },
      { name: 'Dusan Vlahovic', ovr: 85, line: 'FWD', pos: 'ST', age: 25, nat: 'Serbia', val: 65 },
      { name: 'Kenan Yildiz', ovr: 81, line: 'FWD', pos: 'LW', age: 19, nat: 'Turkey', val: 40 },
      { name: 'Nico Gonzalez', ovr: 82, line: 'FWD', pos: 'RW', age: 26, nat: 'Argentina', val: 35 },
      { name: 'Francisco Conceicao', ovr: 80, line: 'FWD', pos: 'RW', age: 22, nat: 'Portugal', val: 25 },
    ]
  },
  {
    league: 'Serie A',
    team: 'Napoli',
    players: [
      { name: 'Alex Meret', ovr: 81, line: 'GK', pos: 'GK', age: 27, nat: 'Italy', val: 12 },
      { name: 'Alessandro Buongiorno', ovr: 83, line: 'DEF', pos: 'CB', age: 25, nat: 'Italy', val: 40 },
      { name: 'Amir Rrahmani', ovr: 81, line: 'DEF', pos: 'CB', age: 31, nat: 'Kosovo', val: 15 },
      { name: 'Giovanni Di Lorenzo', ovr: 83, line: 'DEF', pos: 'RB', age: 31, nat: 'Italy', val: 15 },
      { name: 'Mathias Olivera', ovr: 79, line: 'DEF', pos: 'LB', age: 27, nat: 'Uruguay', val: 15 },
      { name: 'Stanislav Lobotka', ovr: 84, line: 'MID', pos: 'CDM', age: 30, nat: 'Slovakia', val: 28 },
      { name: 'Andre-Frank Zambo Anguissa', ovr: 83, line: 'MID', pos: 'CM', age: 29, nat: 'Cameroon', val: 27 },
      { name: 'Scott McTominay', ovr: 82, line: 'MID', pos: 'CM', age: 28, nat: 'Scotland', val: 32 },
      { name: 'Billy Gilmour', ovr: 79, line: 'MID', pos: 'CM', age: 23, nat: 'Scotland', val: 20 },
      { name: 'Khvicha Kvaratskhelia', ovr: 87, line: 'FWD', pos: 'LW', age: 24, nat: 'Georgia', val: 85 },
      { name: 'Romelu Lukaku', ovr: 84, line: 'FWD', pos: 'ST', age: 31, nat: 'Belgium', val: 30 },
      { name: 'Matteo Politano', ovr: 81, line: 'FWD', pos: 'RW', age: 31, nat: 'Italy', val: 13 },
      { name: 'Giacomo Raspadori', ovr: 80, line: 'FWD', pos: 'ST', age: 25, nat: 'Italy', val: 25 },
    ]
  },
  {
    league: 'Serie A',
    team: 'Roma',
    players: [
      { name: 'Mile Svilar', ovr: 81, line: 'GK', pos: 'GK', age: 25, nat: 'Serbia', val: 14 },
      { name: 'Gianluca Mancini', ovr: 82, line: 'DEF', pos: 'CB', age: 28, nat: 'Italy', val: 25 },
      { name: 'Evan Ndicka', ovr: 81, line: 'DEF', pos: 'CB', age: 25, nat: 'Ivory Coast', val: 28 },
      { name: 'Angelino', ovr: 80, line: 'DEF', pos: 'LB', age: 28, nat: 'Spain', val: 12 },
      { name: 'Zeki Celik', ovr: 77, line: 'DEF', pos: 'RB', age: 27, nat: 'Turkey', val: 6 },
      { name: 'Lorenzo Pellegrini', ovr: 82, line: 'MID', pos: 'CAM', age: 28, nat: 'Italy', val: 22 },
      { name: 'Manu Kone', ovr: 81, line: 'MID', pos: 'CM', age: 23, nat: 'France', val: 25 },
      { name: 'Bryan Cristante', ovr: 80, line: 'MID', pos: 'CDM', age: 29, nat: 'Italy', val: 12 },
      { name: 'Leandro Paredes', ovr: 80, line: 'MID', pos: 'CDM', age: 30, nat: 'Argentina', val: 8 },
      { name: 'Paulo Dybala', ovr: 86, line: 'FWD', pos: 'ST', age: 31, nat: 'Argentina', val: 12 },
      { name: 'Artem Dovbyk', ovr: 83, line: 'FWD', pos: 'ST', age: 27, nat: 'Ukraine', val: 35 },
      { name: 'Matias Soule', ovr: 80, line: 'FWD', pos: 'RW', age: 21, nat: 'Argentina', val: 25 },
      { name: 'Stephan El Shaarawy', ovr: 78, line: 'FWD', pos: 'LW', age: 32, nat: 'Italy', val: 5 },
    ]
  },
  {
    league: 'Serie A',
    team: 'Atalanta',
    players: [
      { name: 'Marco Carnesecchi', ovr: 81, line: 'GK', pos: 'GK', age: 24, nat: 'Italy', val: 20 },
      { name: 'Giorgio Scalvini', ovr: 82, line: 'DEF', pos: 'CB', age: 21, nat: 'Italy', val: 45 },
      { name: 'Isak Hien', ovr: 81, line: 'DEF', pos: 'CB', age: 26, nat: 'Sweden', val: 25 },
      { name: 'Davide Zappacosta', ovr: 79, line: 'DEF', pos: 'RB', age: 32, nat: 'Italy', val: 6 },
      { name: 'Matteo Ruggeri', ovr: 79, line: 'DEF', pos: 'LB', age: 22, nat: 'Italy', val: 20 },
      { name: 'Ederson', ovr: 84, line: 'MID', pos: 'CM', age: 25, nat: 'Brazil', val: 40 },
      { name: 'Marten de Roon', ovr: 80, line: 'MID', pos: 'CDM', age: 33, nat: 'Netherlands', val: 6 },
      { name: 'Mario Pasalic', ovr: 80, line: 'MID', pos: 'CM', age: 30, nat: 'Croatia', val: 13 },
      { name: 'Lazar Samardzic', ovr: 80, line: 'MID', pos: 'CAM', age: 23, nat: 'Serbia', val: 20 },
      { name: 'Ademola Lookman', ovr: 85, line: 'FWD', pos: 'LW', age: 27, nat: 'Nigeria', val: 40 },
      { name: 'Mateo Retegui', ovr: 82, line: 'FWD', pos: 'ST', age: 25, nat: 'Italy', val: 30 },
      { name: 'Charles De Ketelaere', ovr: 82, line: 'FWD', pos: 'RW', age: 23, nat: 'Belgium', val: 35 },
      { name: 'Gianluca Scamacca', ovr: 81, line: 'FWD', pos: 'ST', age: 26, nat: 'Italy', val: 35 },
    ]
  },
  {
    league: 'Serie A',
    team: 'Lazio',
    players: [
      { name: 'Ivan Provedel', ovr: 81, line: 'GK', pos: 'GK', age: 30, nat: 'Italy', val: 14 },
      { name: 'Alessio Romagnoli', ovr: 81, line: 'DEF', pos: 'CB', age: 30, nat: 'Italy', val: 15 },
      { name: 'Mario Gila', ovr: 79, line: 'DEF', pos: 'CB', age: 24, nat: 'Spain', val: 18 },
      { name: 'Manuel Lazzari', ovr: 78, line: 'DEF', pos: 'RB', age: 31, nat: 'Italy', val: 6 },
      { name: 'Nuno Tavares', ovr: 80, line: 'DEF', pos: 'LB', age: 25, nat: 'Portugal', val: 15 },
      { name: 'Matteo Guendouzi', ovr: 82, line: 'MID', pos: 'CM', age: 25, nat: 'France', val: 32 },
      { name: 'Nicolo Rovella', ovr: 80, line: 'MID', pos: 'CDM', age: 23, nat: 'Italy', val: 22 },
      { name: 'Matias Vecino', ovr: 78, line: 'MID', pos: 'CM', age: 33, nat: 'Uruguay', val: 3 },
      { name: 'Gaetano Castrovilli', ovr: 77, line: 'MID', pos: 'CM', age: 28, nat: 'Italy', val: 5 },
      { name: 'Mattia Zaccagni', ovr: 82, line: 'FWD', pos: 'LW', age: 29, nat: 'Italy', val: 20 },
      { name: 'Valentin Castellanos', ovr: 80, line: 'FWD', pos: 'ST', age: 26, nat: 'Argentina', val: 20 },
      { name: 'Boulaye Dia', ovr: 80, line: 'FWD', pos: 'ST', age: 28, nat: 'Senegal', val: 15 },
      { name: 'Gustav Isaksen', ovr: 78, line: 'FWD', pos: 'RW', age: 23, nat: 'Denmark', val: 12 },
    ]
  },

  // ==========================================
  // BUNDESLIGA (7 teams)
  // ==========================================
  {
    league: 'Bundesliga',
    team: 'Bayern Munich',
    players: [
      { name: 'Manuel Neuer', ovr: 87, line: 'GK', pos: 'GK', age: 38, nat: 'Germany', val: 5 },
      { name: 'Dayot Upamecano', ovr: 85, line: 'DEF', pos: 'CB', age: 26, nat: 'France', val: 50 },
      { name: 'Kim Min-jae', ovr: 85, line: 'DEF', pos: 'CB', age: 28, nat: 'South Korea', val: 45 },
      { name: 'Alphonso Davies', ovr: 86, line: 'DEF', pos: 'LB', age: 24, nat: 'Canada', val: 50 },
      { name: 'Josip Stanisic', ovr: 80, line: 'DEF', pos: 'RB', age: 24, nat: 'Croatia', val: 28 },
      { name: 'Joshua Kimmich', ovr: 88, line: 'MID', pos: 'CM', age: 30, nat: 'Germany', val: 50 },
      { name: 'Jamal Musiala', ovr: 90, line: 'MID', pos: 'CAM', age: 21, nat: 'Germany', val: 130 },
      { name: 'Joao Palhinha', ovr: 86, line: 'MID', pos: 'CDM', age: 29, nat: 'Portugal', val: 55 },
      { name: 'Aleksandar Pavlovic', ovr: 81, line: 'MID', pos: 'CM', age: 20, nat: 'Germany', val: 50 },
      { name: 'Leon Goretzka', ovr: 83, line: 'MID', pos: 'CM', age: 30, nat: 'Germany', val: 22 },
      { name: 'Harry Kane', ovr: 91, line: 'FWD', pos: 'ST', age: 31, nat: 'England', val: 100 },
      { name: 'Leroy Sane', ovr: 86, line: 'FWD', pos: 'RW', age: 29, nat: 'Germany', val: 60 },
      { name: 'Michael Olise', ovr: 84, line: 'FWD', pos: 'RW', age: 23, nat: 'France', val: 65 },
    ]
  },
  {
    league: 'Bundesliga',
    team: 'Borussia Dortmund',
    players: [
      { name: 'Gregor Kobel', ovr: 87, line: 'GK', pos: 'GK', age: 27, nat: 'Switzerland', val: 40 },
      { name: 'Nico Schlotterbeck', ovr: 85, line: 'DEF', pos: 'CB', age: 25, nat: 'Germany', val: 40 },
      { name: 'Waldemar Anton', ovr: 82, line: 'DEF', pos: 'CB', age: 28, nat: 'Germany', val: 24 },
      { name: 'Yan Couto', ovr: 80, line: 'DEF', pos: 'RB', age: 22, nat: 'Brazil', val: 25 },
      { name: 'Ramy Bensebaini', ovr: 79, line: 'DEF', pos: 'LB', age: 29, nat: 'Algeria', val: 8 },
      { name: 'Julian Brandt', ovr: 85, line: 'MID', pos: 'CAM', age: 28, nat: 'Germany', val: 40 },
      { name: 'Marcel Sabitzer', ovr: 83, line: 'MID', pos: 'CM', age: 30, nat: 'Austria', val: 20 },
      { name: 'Emre Can', ovr: 81, line: 'MID', pos: 'CDM', age: 31, nat: 'Germany', val: 10 },
      { name: 'Felix Nmecha', ovr: 79, line: 'MID', pos: 'CM', age: 24, nat: 'Germany', val: 20 },
      { name: 'Serhou Guirassy', ovr: 85, line: 'FWD', pos: 'ST', age: 28, nat: 'Guinea', val: 45 },
      { name: 'Donyell Malen', ovr: 82, line: 'FWD', pos: 'RW', age: 26, nat: 'Netherlands', val: 40 },
      { name: 'Karim Adeyemi', ovr: 82, line: 'FWD', pos: 'LW', age: 23, nat: 'Germany', val: 35 },
      { name: 'Jamie Gittens', ovr: 80, line: 'FWD', pos: 'LW', age: 20, nat: 'England', val: 35 },
    ]
  },
  {
    league: 'Bundesliga',
    team: 'Bayer Leverkusen',
    players: [
      { name: 'Lukas Hradecky', ovr: 83, line: 'GK', pos: 'GK', age: 35, nat: 'Finland', val: 3 },
      { name: 'Jonathan Tah', ovr: 86, line: 'DEF', pos: 'CB', age: 29, nat: 'Germany', val: 30 },
      { name: 'Edmond Tapsoba', ovr: 84, line: 'DEF', pos: 'CB', age: 26, nat: 'Burkina Faso', val: 45 },
      { name: 'Jeremie Frimpong', ovr: 86, line: 'DEF', pos: 'RB', age: 24, nat: 'Netherlands', val: 50 },
      { name: 'Alejandro Grimaldo', ovr: 86, line: 'DEF', pos: 'LB', age: 29, nat: 'Spain', val: 45 },
      { name: 'Florian Wirtz', ovr: 90, line: 'MID', pos: 'CAM', age: 21, nat: 'Germany', val: 130 },
      { name: 'Granit Xhaka', ovr: 86, line: 'MID', pos: 'CM', age: 32, nat: 'Switzerland', val: 20 },
      { name: 'Exequiel Palacios', ovr: 84, line: 'MID', pos: 'CM', age: 26, nat: 'Argentina', val: 45 },
      { name: 'Robert Andrich', ovr: 83, line: 'MID', pos: 'CDM', age: 30, nat: 'Germany', val: 17 },
      { name: 'Aleix Garcia', ovr: 82, line: 'MID', pos: 'CM', age: 27, nat: 'Spain', val: 25 },
      { name: 'Victor Boniface', ovr: 84, line: 'FWD', pos: 'ST', age: 24, nat: 'Nigeria', val: 45 },
      { name: 'Patrik Schick', ovr: 81, line: 'FWD', pos: 'ST', age: 29, nat: 'Czech Republic', val: 22 },
      { name: 'Martin Terrier', ovr: 80, line: 'FWD', pos: 'LW', age: 27, nat: 'France', val: 20 },
    ]
  },
  {
    league: 'Bundesliga',
    team: 'RB Leipzig',
    players: [
      { name: 'Peter Gulacsi', ovr: 82, line: 'GK', pos: 'GK', age: 34, nat: 'Hungary', val: 3 },
      { name: 'Castello Lukeba', ovr: 82, line: 'DEF', pos: 'CB', age: 22, nat: 'France', val: 40 },
      { name: 'Willi Orban', ovr: 82, line: 'DEF', pos: 'CB', age: 32, nat: 'Hungary', val: 10 },
      { name: 'David Raum', ovr: 82, line: 'DEF', pos: 'LB', age: 26, nat: 'Germany', val: 25 },
      { name: 'Lutsharel Geertruida', ovr: 81, line: 'DEF', pos: 'RB', age: 24, nat: 'Netherlands', val: 32 },
      { name: 'Xavi Simons', ovr: 85, line: 'MID', pos: 'CAM', age: 21, nat: 'Netherlands', val: 80 },
      { name: 'Amadou Haidara', ovr: 80, line: 'MID', pos: 'CM', age: 27, nat: 'Mali', val: 20 },
      { name: 'Nicolas Seiwald', ovr: 79, line: 'MID', pos: 'CDM', age: 23, nat: 'Austria', val: 18 },
      { name: 'Kevin Kampl', ovr: 78, line: 'MID', pos: 'CM', age: 34, nat: 'Slovenia', val: 3 },
      { name: 'Lois Openda', ovr: 85, line: 'FWD', pos: 'ST', age: 25, nat: 'Belgium', val: 60 },
      { name: 'Benjamin Sesko', ovr: 83, line: 'FWD', pos: 'ST', age: 21, nat: 'Slovenia', val: 50 },
      { name: 'Christoph Baumgartner', ovr: 80, line: 'FWD', pos: 'CAM', age: 25, nat: 'Austria', val: 18 },
      { name: 'Antonio Nusa', ovr: 79, line: 'FWD', pos: 'LW', age: 19, nat: 'Norway', val: 22 },
    ]
  },
  {
    league: 'Bundesliga',
    team: 'VfB Stuttgart',
    players: [
      { name: 'Alexander Nubel', ovr: 81, line: 'GK', pos: 'GK', age: 28, nat: 'Germany', val: 12 },
      { name: 'Jeff Chabot', ovr: 79, line: 'DEF', pos: 'CB', age: 27, nat: 'Germany', val: 12 },
      { name: 'Anthony Rouault', ovr: 78, line: 'DEF', pos: 'CB', age: 23, nat: 'France', val: 10 },
      { name: 'Maximilian Mittelstadt', ovr: 81, line: 'DEF', pos: 'LB', age: 27, nat: 'Germany', val: 17 },
      { name: 'Josha Vagnoman', ovr: 78, line: 'DEF', pos: 'RB', age: 24, nat: 'Germany', val: 10 },
      { name: 'Angelo Stiller', ovr: 82, line: 'MID', pos: 'CM', age: 23, nat: 'Germany', val: 28 },
      { name: 'Enzo Millot', ovr: 81, line: 'MID', pos: 'CAM', age: 22, nat: 'France', val: 42 },
      { name: 'Atakan Karazor', ovr: 79, line: 'MID', pos: 'CDM', age: 28, nat: 'Germany', val: 12 },
      { name: 'Chris Fuhrich', ovr: 81, line: 'MID', pos: 'CAM', age: 27, nat: 'Germany', val: 22 },
      { name: 'Deniz Undav', ovr: 83, line: 'FWD', pos: 'ST', age: 28, nat: 'Germany', val: 28 },
      { name: 'Ermedin Demirovic', ovr: 81, line: 'FWD', pos: 'ST', age: 26, nat: 'Bosnia', val: 28 },
      { name: 'Jamie Leweling', ovr: 79, line: 'FWD', pos: 'RW', age: 23, nat: 'Germany', val: 13 },
      { name: 'El Bilal Toure', ovr: 78, line: 'FWD', pos: 'ST', age: 23, nat: 'Mali', val: 20 },
    ]
  },
  {
    league: 'Bundesliga',
    team: 'Eintracht Frankfurt',
    players: [
      { name: 'Kevin Trapp', ovr: 81, line: 'GK', pos: 'GK', age: 34, nat: 'Germany', val: 4 },
      { name: 'Robin Koch', ovr: 81, line: 'DEF', pos: 'CB', age: 28, nat: 'Germany', val: 18 },
      { name: 'Arthur Theate', ovr: 80, line: 'DEF', pos: 'CB', age: 24, nat: 'Belgium', val: 24 },
      { name: 'Rasmus Kristensen', ovr: 79, line: 'DEF', pos: 'RB', age: 27, nat: 'Denmark', val: 12 },
      { name: 'Niels Nkounkou', ovr: 78, line: 'DEF', pos: 'LB', age: 24, nat: 'France', val: 9 },
      { name: 'Mario Gotze', ovr: 81, line: 'MID', pos: 'CAM', age: 32, nat: 'Germany', val: 6 },
      { name: 'Ellyes Skhiri', ovr: 81, line: 'MID', pos: 'CDM', age: 29, nat: 'Tunisia', val: 11 },
      { name: 'Hugo Larsson', ovr: 80, line: 'MID', pos: 'CM', age: 20, nat: 'Sweden', val: 28 },
      { name: 'Fares Chaibi', ovr: 78, line: 'MID', pos: 'CAM', age: 22, nat: 'Algeria', val: 18 },
      { name: 'Omar Marmoush', ovr: 85, line: 'FWD', pos: 'ST', age: 26, nat: 'Egypt', val: 60 },
      { name: 'Hugo Ekitike', ovr: 81, line: 'FWD', pos: 'ST', age: 22, nat: 'France', val: 30 },
      { name: 'Ansgar Knauff', ovr: 78, line: 'FWD', pos: 'RW', age: 23, nat: 'Germany', val: 10 },
      { name: 'Igor Matanovic', ovr: 77, line: 'FWD', pos: 'ST', age: 21, nat: 'Croatia', val: 8 },
    ]
  },
  {
    league: 'Bundesliga',
    team: 'VfL Wolfsburg',
    players: [
      { name: 'Kamil Grabara', ovr: 79, line: 'GK', pos: 'GK', age: 26, nat: 'Poland', val: 14 },
      { name: 'Sebastiaan Bornauw', ovr: 78, line: 'DEF', pos: 'CB', age: 25, nat: 'Belgium', val: 8 },
      { name: 'Denis Vavro', ovr: 77, line: 'DEF', pos: 'CB', age: 28, nat: 'Slovakia', val: 5 },
      { name: 'Joakim Maehle', ovr: 79, line: 'DEF', pos: 'LB', age: 27, nat: 'Denmark', val: 14 },
      { name: 'Kilian Fischer', ovr: 76, line: 'DEF', pos: 'RB', age: 24, nat: 'Germany', val: 4 },
      { name: 'Maximilian Arnold', ovr: 80, line: 'MID', pos: 'CM', age: 30, nat: 'Germany', val: 10 },
      { name: 'Lovro Majer', ovr: 80, line: 'MID', pos: 'CAM', age: 27, nat: 'Croatia', val: 20 },
      { name: 'Mattias Svanberg', ovr: 78, line: 'MID', pos: 'CM', age: 26, nat: 'Sweden', val: 12 },
      { name: 'Salih Ozcan', ovr: 78, line: 'MID', pos: 'CDM', age: 27, nat: 'Turkey', val: 9 },
      { name: 'Jonas Wind', ovr: 80, line: 'FWD', pos: 'ST', age: 26, nat: 'Denmark', val: 15 },
      { name: 'Mohamed Amoura', ovr: 80, line: 'FWD', pos: 'ST', age: 24, nat: 'Algeria', val: 16 },
      { name: 'Patrick Wimmer', ovr: 78, line: 'FWD', pos: 'RW', age: 23, nat: 'Austria', val: 12 },
      { name: 'Tiago Tomas', ovr: 77, line: 'FWD', pos: 'RW', age: 22, nat: 'Portugal', val: 8 },
    ]
  },

  // ==========================================
  // LIGUE 1 (7 teams)
  // ==========================================
  {
    league: 'Ligue 1',
    team: 'PSG',
    players: [
      { name: 'Gianluigi Donnarumma', ovr: 88, line: 'GK', pos: 'GK', age: 26, nat: 'Italy', val: 40 },
      { name: 'Marquinhos', ovr: 87, line: 'DEF', pos: 'CB', age: 30, nat: 'Brazil', val: 45 },
      { name: 'Achraf Hakimi', ovr: 88, line: 'DEF', pos: 'RB', age: 26, nat: 'Morocco', val: 60 },
      { name: 'Nuno Mendes', ovr: 85, line: 'DEF', pos: 'LB', age: 22, nat: 'Portugal', val: 55 },
      { name: 'Willian Pacho', ovr: 83, line: 'DEF', pos: 'CB', age: 23, nat: 'Ecuador', val: 40 },
      { name: 'Vitinha', ovr: 86, line: 'MID', pos: 'CM', age: 25, nat: 'Portugal', val: 55 },
      { name: 'Warren Zaire-Emery', ovr: 84, line: 'MID', pos: 'CM', age: 18, nat: 'France', val: 60 },
      { name: 'Joao Neves', ovr: 84, line: 'MID', pos: 'CM', age: 20, nat: 'Portugal', val: 60 },
      { name: 'Fabian Ruiz', ovr: 83, line: 'MID', pos: 'CM', age: 28, nat: 'Spain', val: 35 },
      { name: 'Ousmane Dembele', ovr: 86, line: 'FWD', pos: 'RW', age: 27, nat: 'France', val: 60 },
      { name: 'Bradley Barcola', ovr: 84, line: 'FWD', pos: 'LW', age: 22, nat: 'France', val: 65 },
      { name: 'Goncalo Ramos', ovr: 83, line: 'FWD', pos: 'ST', age: 23, nat: 'Portugal', val: 50 },
      { name: 'Marco Asensio', ovr: 81, line: 'FWD', pos: 'RW', age: 29, nat: 'Spain', val: 20 },
    ]
  },
  {
    league: 'Ligue 1',
    team: 'Marseille',
    players: [
      { name: 'Geronimo Rulli', ovr: 79, line: 'GK', pos: 'GK', age: 32, nat: 'Argentina', val: 5 },
      { name: 'Leonardo Balerdi', ovr: 81, line: 'DEF', pos: 'CB', age: 26, nat: 'Argentina', val: 20 },
      { name: 'Quentin Merlin', ovr: 78, line: 'DEF', pos: 'LB', age: 22, nat: 'France', val: 12 },
      { name: 'Derek Cornelius', ovr: 77, line: 'DEF', pos: 'CB', age: 27, nat: 'Canada', val: 5 },
      { name: 'Michael Murillo', ovr: 77, line: 'DEF', pos: 'RB', age: 29, nat: 'Panama', val: 5 },
      { name: 'Adrien Rabiot', ovr: 84, line: 'MID', pos: 'CM', age: 29, nat: 'France', val: 35 },
      { name: 'Pierre-Emile Hojbjerg', ovr: 83, line: 'MID', pos: 'CDM', age: 29, nat: 'Denmark', val: 18 },
      { name: 'Geoffrey Kondogbia', ovr: 79, line: 'MID', pos: 'CDM', age: 32, nat: 'Central African Republic', val: 7 },
      { name: 'Valentin Rongier', ovr: 78, line: 'MID', pos: 'CM', age: 30, nat: 'France', val: 8 },
      { name: 'Mason Greenwood', ovr: 83, line: 'FWD', pos: 'RW', age: 23, nat: 'England', val: 35 },
      { name: 'Elye Wahi', ovr: 80, line: 'FWD', pos: 'ST', age: 22, nat: 'France', val: 30 },
      { name: 'Amine Harit', ovr: 79, line: 'FWD', pos: 'CAM', age: 27, nat: 'Morocco', val: 15 },
      { name: 'Luis Henrique', ovr: 78, line: 'FWD', pos: 'LW', age: 23, nat: 'Brazil', val: 12 },
    ]
  },
  {
    league: 'Ligue 1',
    team: 'Monaco',
    players: [
      { name: 'Philipp Kohn', ovr: 78, line: 'GK', pos: 'GK', age: 26, nat: 'Switzerland', val: 7 },
      { name: 'Caio Henrique', ovr: 81, line: 'DEF', pos: 'LB', age: 27, nat: 'Brazil', val: 20 },
      { name: 'Thilo Kehrer', ovr: 80, line: 'DEF', pos: 'CB', age: 28, nat: 'Germany', val: 10 },
      { name: 'Vanderson', ovr: 80, line: 'DEF', pos: 'RB', age: 23, nat: 'Brazil', val: 20 },
      { name: 'Mohammed Salisu', ovr: 79, line: 'DEF', pos: 'CB', age: 25, nat: 'Ghana', val: 15 },
      { name: 'Aleksandr Golovin', ovr: 83, line: 'MID', pos: 'CAM', age: 28, nat: 'Russia', val: 30 },
      { name: 'Denis Zakaria', ovr: 82, line: 'MID', pos: 'CDM', age: 28, nat: 'Switzerland', val: 28 },
      { name: 'Maghnes Akliouche', ovr: 81, line: 'MID', pos: 'CAM', age: 23, nat: 'France', val: 30 },
      { name: 'Lamine Camara', ovr: 79, line: 'MID', pos: 'CM', age: 21, nat: 'Senegal', val: 12 },
      { name: 'Takumi Minamino', ovr: 81, line: 'FWD', pos: 'RW', age: 30, nat: 'Japan', val: 20 },
      { name: 'Breel Embolo', ovr: 80, line: 'FWD', pos: 'ST', age: 28, nat: 'Switzerland', val: 12 },
      { name: 'Folarin Balogun', ovr: 80, line: 'FWD', pos: 'ST', age: 23, nat: 'USA', val: 30 },
      { name: 'Eliesse Ben Seghir', ovr: 79, line: 'FWD', pos: 'LW', age: 20, nat: 'Morocco', val: 18 },
    ]
  },
  {
    league: 'Ligue 1',
    team: 'Lille',
    players: [
      { name: 'Lucas Chevalier', ovr: 82, line: 'GK', pos: 'GK', age: 23, nat: 'France', val: 25 },
      { name: 'Bafode Diakite', ovr: 80, line: 'DEF', pos: 'CB', age: 24, nat: 'France', val: 18 },
      { name: 'Alexsandro', ovr: 78, line: 'DEF', pos: 'CB', age: 25, nat: 'Brazil', val: 10 },
      { name: 'Thomas Meunier', ovr: 78, line: 'DEF', pos: 'RB', age: 33, nat: 'Belgium', val: 3 },
      { name: 'Gabriel Gudmundsson', ovr: 78, line: 'DEF', pos: 'LB', age: 25, nat: 'Sweden', val: 8 },
      { name: 'Angel Gomes', ovr: 81, line: 'MID', pos: 'CAM', age: 24, nat: 'England', val: 28 },
      { name: 'Benjamin Andre', ovr: 80, line: 'MID', pos: 'CDM', age: 34, nat: 'France', val: 8 },
      { name: 'Ayyoub Bouaddi', ovr: 77, line: 'MID', pos: 'CM', age: 17, nat: 'France', val: 18 },
      { name: 'Andre Gomes', ovr: 77, line: 'MID', pos: 'CM', age: 31, nat: 'Portugal', val: 6 },
      { name: 'Jonathan David', ovr: 85, line: 'FWD', pos: 'ST', age: 25, nat: 'Canada', val: 45 },
      { name: 'Edon Zhegrova', ovr: 82, line: 'FWD', pos: 'RW', age: 25, nat: 'Kosovo', val: 25 },
      { name: 'Osame Sahraoui', ovr: 78, line: 'FWD', pos: 'LW', age: 23, nat: 'Morocco', val: 10 },
      { name: 'Remy Cabella', ovr: 77, line: 'FWD', pos: 'CAM', age: 34, nat: 'France', val: 3 },
    ]
  },
  {
    league: 'Ligue 1',
    team: 'Lyon',
    players: [
      { name: 'Lucas Perri', ovr: 79, line: 'GK', pos: 'GK', age: 27, nat: 'Brazil', val: 8 },
      { name: 'Moussa Niakhate', ovr: 80, line: 'DEF', pos: 'CB', age: 28, nat: 'Senegal', val: 16 },
      { name: 'Nicolas Tagliafico', ovr: 79, line: 'DEF', pos: 'LB', age: 32, nat: 'Argentina', val: 6 },
      { name: 'Duje Caleta-Car', ovr: 78, line: 'DEF', pos: 'CB', age: 28, nat: 'Croatia', val: 7 },
      { name: 'Ainsley Maitland-Niles', ovr: 78, line: 'DEF', pos: 'RB', age: 27, nat: 'England', val: 9 },
      { name: 'Rayan Cherki', ovr: 81, line: 'MID', pos: 'CAM', age: 21, nat: 'France', val: 20 },
      { name: 'Corentin Tolisso', ovr: 80, line: 'MID', pos: 'CM', age: 30, nat: 'France', val: 7 },
      { name: 'Maxence Caqueret', ovr: 80, line: 'MID', pos: 'CM', age: 25, nat: 'France', val: 18 },
      { name: 'Nemanja Matic', ovr: 79, line: 'MID', pos: 'CDM', age: 36, nat: 'Serbia', val: 3 },
      { name: 'Alexandre Lacazette', ovr: 82, line: 'FWD', pos: 'ST', age: 33, nat: 'France', val: 9 },
      { name: 'Georges Mikautadze', ovr: 81, line: 'FWD', pos: 'ST', age: 24, nat: 'Georgia', val: 20 },
      { name: 'Malick Fofana', ovr: 79, line: 'FWD', pos: 'LW', age: 19, nat: 'Belgium', val: 15 },
      { name: 'Ernest Nuamah', ovr: 78, line: 'FWD', pos: 'RW', age: 21, nat: 'Ghana', val: 18 },
    ]
  },
  {
    league: 'Ligue 1',
    team: 'Nice',
    players: [
      { name: 'Marcin Bulka', ovr: 82, line: 'GK', pos: 'GK', age: 25, nat: 'Poland', val: 20 },
      { name: 'Jonathan Clauss', ovr: 80, line: 'DEF', pos: 'RB', age: 32, nat: 'France', val: 10 },
      { name: 'Youssouf Ndayishimiye', ovr: 80, line: 'DEF', pos: 'CB', age: 26, nat: 'Burundi', val: 18 },
      { name: 'Melvin Bard', ovr: 79, line: 'DEF', pos: 'LB', age: 24, nat: 'France', val: 12 },
      { name: 'Dante', ovr: 78, line: 'DEF', pos: 'CB', age: 41, nat: 'Brazil', val: 1 },
      { name: 'Hicham Boudaoui', ovr: 80, line: 'MID', pos: 'CM', age: 25, nat: 'Algeria', val: 10 },
      { name: 'Tanguy Ndombele', ovr: 79, line: 'MID', pos: 'CM', age: 28, nat: 'France', val: 8 },
      { name: 'Pablo Rosario', ovr: 78, line: 'MID', pos: 'CDM', age: 28, nat: 'Netherlands', val: 8 },
      { name: 'Morgan Sanson', ovr: 78, line: 'MID', pos: 'CM', age: 30, nat: 'France', val: 6 },
      { name: 'Terem Moffi', ovr: 80, line: 'FWD', pos: 'ST', age: 25, nat: 'Nigeria', val: 20 },
      { name: 'Jeremie Boga', ovr: 80, line: 'FWD', pos: 'LW', age: 28, nat: 'Ivory Coast', val: 15 },
      { name: 'Gaetan Laborde', ovr: 79, line: 'FWD', pos: 'ST', age: 30, nat: 'France', val: 8 },
      { name: 'Evann Guessand', ovr: 78, line: 'FWD', pos: 'ST', age: 23, nat: 'Ivory Coast', val: 8 },
    ]
  },
  {
    league: 'Ligue 1',
    team: 'Lens',
    players: [
      { name: 'Brice Samba', ovr: 82, line: 'GK', pos: 'GK', age: 30, nat: 'France', val: 15 },
      { name: 'Kevin Danso', ovr: 82, line: 'DEF', pos: 'CB', age: 26, nat: 'Austria', val: 25 },
      { name: 'Facundo Medina', ovr: 81, line: 'DEF', pos: 'CB', age: 25, nat: 'Argentina', val: 25 },
      { name: 'Przemyslaw Frankowski', ovr: 79, line: 'DEF', pos: 'RB', age: 29, nat: 'Poland', val: 9 },
      { name: 'Deiver Machado', ovr: 78, line: 'DEF', pos: 'LB', age: 31, nat: 'Colombia', val: 5 },
      { name: 'Andy Diouf', ovr: 79, line: 'MID', pos: 'CM', age: 21, nat: 'France', val: 12 },
      { name: 'Adrien Thomasson', ovr: 78, line: 'MID', pos: 'CM', age: 31, nat: 'France', val: 6 },
      { name: 'Nampalys Mendy', ovr: 77, line: 'MID', pos: 'CDM', age: 32, nat: 'Senegal', val: 4 },
      { name: 'Angelo Fulgini', ovr: 77, line: 'MID', pos: 'CAM', age: 28, nat: 'France', val: 6 },
      { name: 'Florian Sotoca', ovr: 79, line: 'FWD', pos: 'ST', age: 34, nat: 'France', val: 4 },
      { name: 'Wesley Said', ovr: 78, line: 'FWD', pos: 'ST', age: 29, nat: 'France', val: 6 },
      { name: 'M\'Bala Nzola', ovr: 78, line: 'FWD', pos: 'ST', age: 28, nat: 'Angola', val: 7 },
      { name: 'Remy Labeau Lascary', ovr: 76, line: 'FWD', pos: 'RW', age: 21, nat: 'France', val: 5 },
    ]
  },
];

// Flatten, validate and index
const allPlayers = [];
let nextId = 1;

for (const t of rawTeams) {
  if (t.players.length !== 13) {
    throw new Error(`Team ${t.team} has ${t.players.length} players, expected 13!`);
  }

  const gks = t.players.filter(p => p.line === 'GK').length;
  const defs = t.players.filter(p => p.line === 'DEF').length;
  const mids = t.players.filter(p => p.line === 'MID').length;
  const fwds = t.players.filter(p => p.line === 'FWD').length;

  if (gks < 1 || defs < 4 || mids < 4 || fwds < 3) {
    throw new Error(`Team ${t.team} failed line constraint! GK:${gks}, DEF:${defs}, MID:${mids}, FWD:${fwds}`);
  }

  for (const p of t.players) {
    allPlayers.push({
      id: nextId++,
      name: p.name,
      ovr: p.ovr,
      line: p.line,
      specific_position: p.pos,
      team: t.team,
      league: t.league,
      age: p.age,
      nationality: p.nat,
      value: p.val
    });
  }
}

if (allPlayers.length !== 455) {
  throw new Error(`Total players: ${allPlayers.length}, expected 455!`);
}

const outPath = path.resolve(__dirname, '../src/data/players.json');
fs.writeFileSync(outPath, JSON.stringify(allPlayers, null, 2), 'utf-8');
console.log(`Successfully generated ${allPlayers.length} players across ${rawTeams.length} teams in ${outPath}!`);
