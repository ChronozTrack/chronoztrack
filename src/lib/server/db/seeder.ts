import { createSchemaFactory } from "drizzle-zod";
import { eq } from 'drizzle-orm';
import { db } from "$lib/server/db";
import { tblUserDesignation, tblUsers, tblUserSchedule } from './schema';
import { hashPassword } from "../controller/auth";
import { z } from 'zod';
import type { SvelteFetch } from "$lib/app-types";

const PASSWORD = 'pa55word'
const { createInsertSchema } = createSchemaFactory({ coerce: true });
const USERS = [
  {
    "id": "457042",
    "active": "1",
    "name": "Sherry Hyatt",
    "roleId": "5",
    "passwordHash": null,
    "supervisorId": null
  },
  {
    "id": "478224",
    "active": "1",
    "name": "Candace Doyle",
    "roleId": "5",
    "passwordHash": null,
    "supervisorId": null
  },
  {
    "id": "489776",
    "active": "1",
    "name": "Franklin Weimann",
    "roleId": "5",
    "passwordHash": null,
    "supervisorId": null
  },
  {
    "id": "432174",
    "active": "1",
    "name": "Mr. Ignacio Tremblay",
    "roleId": "6",
    "passwordHash": null,
    "supervisorId": "457042"
  },
  {
    "id": "487742",
    "active": "1",
    "name": "Raul Williamson",
    "roleId": "8",
    "passwordHash": null,
    "supervisorId": "457042"
  },
  {
    "id": "456288",
    "active": "1",
    "name": "Rafael Barton",
    "roleId": "7",
    "passwordHash": null,
    "supervisorId": "489776"
  },
  {
    "id": "481914",
    "active": "1",
    "name": "Julie King",
    "roleId": "6",
    "passwordHash": null,
    "supervisorId": "489776"
  },
  {
    "id": "491836",
    "active": "1",
    "name": "Carolyn Von",
    "roleId": "8",
    "passwordHash": null,
    "supervisorId": "457042"
  },
  {
    "id": "477513",
    "active": "1",
    "name": "Steve McKenzie-Gibson",
    "roleId": "7",
    "passwordHash": null,
    "supervisorId": "489776"
  },
  {
    "id": "470910",
    "active": "1",
    "name": "Matthew Leuschke",
    "roleId": "7",
    "passwordHash": null,
    "supervisorId": "489776"
  },
  {
    "id": "440247",
    "active": "1",
    "name": "Dave King",
    "roleId": "6",
    "passwordHash": null,
    "supervisorId": "457042"
  },
  {
    "id": "416701",
    "active": "1",
    "name": "Yvonne Rolfson",
    "roleId": "6",
    "passwordHash": null,
    "supervisorId": "457042"
  },
  {
    "id": "415516",
    "active": "1",
    "name": "Jacquelyn Hermiston DDS",
    "roleId": "6",
    "passwordHash": null,
    "supervisorId": "489776"
  },
  {
    "id": "413921",
    "active": "1",
    "name": "Adrienne Bergnaum",
    "roleId": "8",
    "passwordHash": null,
    "supervisorId": "457042"
  },
  {
    "id": "466663",
    "active": "1",
    "name": "Dr. Perry Abernathy",
    "roleId": "6",
    "passwordHash": null,
    "supervisorId": "478224"
  },
  {
    "id": "467465",
    "active": "1",
    "name": "Laverne Mueller",
    "roleId": "7",
    "passwordHash": null,
    "supervisorId": "489776"
  },
  {
    "id": "495207",
    "active": "1",
    "name": "Tanya Roberts I",
    "roleId": "6",
    "passwordHash": null,
    "supervisorId": "489776"
  },
  {
    "id": "480594",
    "active": "1",
    "name": "Matthew Leannon",
    "roleId": "7",
    "passwordHash": null,
    "supervisorId": "478224"
  },
  {
    "id": "466236",
    "active": "1",
    "name": "Christie Lind",
    "roleId": "6",
    "passwordHash": null,
    "supervisorId": "489776"
  },
  {
    "id": "429805",
    "active": "1",
    "name": "Salvador Johnson-MacGyver",
    "roleId": "8",
    "passwordHash": null,
    "supervisorId": "457042"
  },
  {
    "id": "464458",
    "active": "1",
    "name": "Kristin Rolfson",
    "roleId": "8",
    "passwordHash": null,
    "supervisorId": "489776"
  },
  {
    "id": "461692",
    "active": "1",
    "name": "Mr. Kevin Breitenberg",
    "roleId": "8",
    "passwordHash": null,
    "supervisorId": "489776"
  },
  {
    "id": "420434",
    "active": "1",
    "name": "Faith Mante",
    "roleId": "8",
    "passwordHash": null,
    "supervisorId": "489776"
  },
  {
    "id": "414304",
    "active": "1",
    "name": "Roberto Beatty-Stamm",
    "roleId": "4",
    "passwordHash": null,
    "supervisorId": "491836"
  },
  {
    "id": "457252",
    "active": "1",
    "name": "Marianne O'Conner",
    "roleId": "4",
    "passwordHash": null,
    "supervisorId": "467465"
  },
  {
    "id": "492350",
    "active": "1",
    "name": "Aubrey McClure",
    "roleId": "4",
    "passwordHash": null,
    "supervisorId": "416701"
  },
  {
    "id": "433683",
    "active": "1",
    "name": "Kelly Runolfsdottir",
    "roleId": "4",
    "passwordHash": null,
    "supervisorId": "429805"
  },
  {
    "id": "459221",
    "active": "1",
    "name": "Monica Schneider",
    "roleId": "4",
    "passwordHash": null,
    "supervisorId": "491836"
  },
  {
    "id": "496680",
    "active": "1",
    "name": "Cathy Rempel",
    "roleId": "4",
    "passwordHash": null,
    "supervisorId": "432174"
  },
  {
    "id": "438808",
    "active": "1",
    "name": "Kim Morissette",
    "roleId": "4",
    "passwordHash": null,
    "supervisorId": "461692"
  },
  {
    "id": "449483",
    "active": "1",
    "name": "Clay Grimes",
    "roleId": "4",
    "passwordHash": null,
    "supervisorId": "477513"
  },
  {
    "id": "478610",
    "active": "1",
    "name": "Elsie Windler",
    "roleId": "4",
    "passwordHash": null,
    "supervisorId": "461692"
  },
  {
    "id": "474376",
    "active": "1",
    "name": "Ms. Joy Willms",
    "roleId": "4",
    "passwordHash": null,
    "supervisorId": "487742"
  },
  {
    "id": "429807",
    "active": "1",
    "name": "Casey Grady II",
    "roleId": "4",
    "passwordHash": null,
    "supervisorId": "491836"
  },
  {
    "id": "464591",
    "active": "1",
    "name": "Miss Jessie Hegmann",
    "roleId": "4",
    "passwordHash": null,
    "supervisorId": "413921"
  },
  {
    "id": "442513",
    "active": "1",
    "name": "Dr. Manuel Franey",
    "roleId": "4",
    "passwordHash": null,
    "supervisorId": "480594"
  },
  {
    "id": "400746",
    "active": "1",
    "name": "Rene Beahan",
    "roleId": "4",
    "passwordHash": null,
    "supervisorId": "440247"
  },
  {
    "id": "499613",
    "active": "1",
    "name": "Jan Hodkiewicz",
    "roleId": "4",
    "passwordHash": null,
    "supervisorId": "470910"
  },
  {
    "id": "437426",
    "active": "1",
    "name": "Greg Prohaska",
    "roleId": "4",
    "passwordHash": null,
    "supervisorId": "456288"
  },
  {
    "id": "431417",
    "active": "1",
    "name": "Ervin Hand",
    "roleId": "4",
    "passwordHash": null,
    "supervisorId": "429805"
  },
  {
    "id": "404058",
    "active": "1",
    "name": "Nora Christiansen",
    "roleId": "4",
    "passwordHash": null,
    "supervisorId": "495207"
  },
  {
    "id": "491957",
    "active": "1",
    "name": "Kristin Heathcote",
    "roleId": "4",
    "passwordHash": null,
    "supervisorId": "480594"
  },
  {
    "id": "403436",
    "active": "1",
    "name": "Miss Margaret Gusikowski",
    "roleId": "4",
    "passwordHash": null,
    "supervisorId": "480594"
  },
  {
    "id": "451355",
    "active": "1",
    "name": "Mitchell Aufderhar",
    "roleId": "4",
    "passwordHash": null,
    "supervisorId": "491836"
  },
  {
    "id": "453318",
    "active": "1",
    "name": "Dennis Wunsch",
    "roleId": "4",
    "passwordHash": null,
    "supervisorId": "466236"
  },
  {
    "id": "403787",
    "active": "1",
    "name": "Sean Ledner",
    "roleId": "4",
    "passwordHash": null,
    "supervisorId": "487742"
  },
  {
    "id": "407376",
    "active": "1",
    "name": "Silvia Vandervort",
    "roleId": "4",
    "passwordHash": null,
    "supervisorId": "420434"
  },
  {
    "id": "492647",
    "active": "1",
    "name": "William Lakin",
    "roleId": "4",
    "passwordHash": null,
    "supervisorId": "466236"
  },
  {
    "id": "482950",
    "active": "1",
    "name": "Ms. Alice Larson",
    "roleId": "4",
    "passwordHash": null,
    "supervisorId": "495207"
  },
  {
    "id": "410611",
    "active": "1",
    "name": "Billy Rolfson-Considine",
    "roleId": "4",
    "passwordHash": null,
    "supervisorId": "467465"
  },
  {
    "id": "464649",
    "active": "1",
    "name": "Cristina Sporer",
    "roleId": "4",
    "passwordHash": null,
    "supervisorId": "440247"
  },
  {
    "id": "424527",
    "active": "1",
    "name": "Tommy Beahan",
    "roleId": "4",
    "passwordHash": null,
    "supervisorId": "413921"
  },
  {
    "id": "408311",
    "active": "1",
    "name": "Myron Reynolds-Gutmann",
    "roleId": "4",
    "passwordHash": null,
    "supervisorId": "432174"
  },
  {
    "id": "419410",
    "active": "1",
    "name": "Arnold Sawayn",
    "roleId": "4",
    "passwordHash": null,
    "supervisorId": "491836"
  },
  {
    "id": "436952",
    "active": "1",
    "name": "Nathaniel Wintheiser-Nienow",
    "roleId": "4",
    "passwordHash": null,
    "supervisorId": "413921"
  },
  {
    "id": "421482",
    "active": "1",
    "name": "Gretchen Lesch",
    "roleId": "4",
    "passwordHash": null,
    "supervisorId": "466236"
  },
  {
    "id": "418419",
    "active": "1",
    "name": "Abraham Pollich",
    "roleId": "4",
    "passwordHash": null,
    "supervisorId": "477513"
  },
  {
    "id": "418629",
    "active": "1",
    "name": "Hazel Fahey",
    "roleId": "4",
    "passwordHash": null,
    "supervisorId": "420434"
  },
  {
    "id": "403829",
    "active": "1",
    "name": "Connie Schmeler",
    "roleId": "4",
    "passwordHash": null,
    "supervisorId": "415516"
  },
  {
    "id": "468108",
    "active": "1",
    "name": "Mattie Schaefer",
    "roleId": "4",
    "passwordHash": null,
    "supervisorId": "466663"
  },
  {
    "id": "420488",
    "active": "1",
    "name": "Malcolm Kohler",
    "roleId": "4",
    "passwordHash": null,
    "supervisorId": "413921"
  },
  {
    "id": "453044",
    "active": "1",
    "name": "Ana Schultz",
    "roleId": "4",
    "passwordHash": null,
    "supervisorId": "466236"
  },
  {
    "id": "412578",
    "active": "1",
    "name": "Dr. Ellis Keebler",
    "roleId": "4",
    "passwordHash": null,
    "supervisorId": "456288"
  },
  {
    "id": "428809",
    "active": "1",
    "name": "Stephen Koch",
    "roleId": "4",
    "passwordHash": null,
    "supervisorId": "491836"
  },
  {
    "id": "490709",
    "active": "1",
    "name": "Jake Wunsch",
    "roleId": "4",
    "passwordHash": null,
    "supervisorId": "456288"
  },
  {
    "id": "498712",
    "active": "1",
    "name": "Mr. Bert Bashirian-O'Keefe",
    "roleId": "4",
    "passwordHash": null,
    "supervisorId": "466236"
  },
  {
    "id": "424177",
    "active": "1",
    "name": "Debbie Sanford-Ullrich DDS",
    "roleId": "4",
    "passwordHash": null,
    "supervisorId": "477513"
  },
  {
    "id": "483994",
    "active": "1",
    "name": "Evan Ullrich",
    "roleId": "4",
    "passwordHash": null,
    "supervisorId": "461692"
  },
  {
    "id": "455415",
    "active": "1",
    "name": "Becky Nikolaus",
    "roleId": "4",
    "passwordHash": null,
    "supervisorId": "491836"
  },
  {
    "id": "443558",
    "active": "1",
    "name": "Owen Hagenes",
    "roleId": "4",
    "passwordHash": null,
    "supervisorId": "420434"
  },
  {
    "id": "478049",
    "active": "1",
    "name": "Lawrence Waelchi",
    "roleId": "4",
    "passwordHash": null,
    "supervisorId": "466663"
  },
  {
    "id": "474374",
    "active": "1",
    "name": "Raquel Balistreri",
    "roleId": "4",
    "passwordHash": null,
    "supervisorId": "420434"
  },
  {
    "id": "414452",
    "active": "1",
    "name": "Edwin Thompson",
    "roleId": "4",
    "passwordHash": null,
    "supervisorId": "440247"
  },
  {
    "id": "430685",
    "active": "1",
    "name": "Felix Von",
    "roleId": "4",
    "passwordHash": null,
    "supervisorId": "466236"
  },
  {
    "id": "465209",
    "active": "1",
    "name": "Kirk Hoeger MD",
    "roleId": "4",
    "passwordHash": null,
    "supervisorId": "477513"
  },
  {
    "id": "434935",
    "active": "1",
    "name": "Janis Brakus",
    "roleId": "4",
    "passwordHash": null,
    "supervisorId": "420434"
  },
  {
    "id": "421014",
    "active": "1",
    "name": "Kirk Heller",
    "roleId": "4",
    "passwordHash": null,
    "supervisorId": "470910"
  },
  {
    "id": "440959",
    "active": "1",
    "name": "Craig McCullough",
    "roleId": "4",
    "passwordHash": null,
    "supervisorId": "477513"
  },
  {
    "id": "431865",
    "active": "1",
    "name": "Gwen Mertz",
    "roleId": "4",
    "passwordHash": null,
    "supervisorId": "480594"
  },
  {
    "id": "483767",
    "active": "1",
    "name": "Erin Mitchell-Cummings DVM",
    "roleId": "4",
    "passwordHash": null,
    "supervisorId": "495207"
  },
  {
    "id": "405855",
    "active": "1",
    "name": "Minnie Ankunding II",
    "roleId": "4",
    "passwordHash": null,
    "supervisorId": "470910"
  },
  {
    "id": "471377",
    "active": "1",
    "name": "Adam Anderson",
    "roleId": "4",
    "passwordHash": null,
    "supervisorId": "466663"
  },
  {
    "id": "414031",
    "active": "1",
    "name": "Cecilia Bashirian",
    "roleId": "4",
    "passwordHash": null,
    "supervisorId": "480594"
  },
  {
    "id": "491292",
    "active": "1",
    "name": "Neal Russel",
    "roleId": "4",
    "passwordHash": null,
    "supervisorId": "432174"
  },
  {
    "id": "490351",
    "active": "1",
    "name": "Camille Price",
    "roleId": "4",
    "passwordHash": null,
    "supervisorId": "466663"
  },
  {
    "id": "461959",
    "active": "1",
    "name": "Lydia Stokes",
    "roleId": "4",
    "passwordHash": null,
    "supervisorId": "495207"
  },
  {
    "id": "493432",
    "active": "1",
    "name": "Wilma Schoen",
    "roleId": "4",
    "passwordHash": null,
    "supervisorId": "466236"
  },
  {
    "id": "457809",
    "active": "1",
    "name": "Lucille Ryan",
    "roleId": "4",
    "passwordHash": null,
    "supervisorId": "456288"
  },
  {
    "id": "410063",
    "active": "1",
    "name": "Harvey Wolf",
    "roleId": "4",
    "passwordHash": null,
    "supervisorId": "440247"
  },
  {
    "id": "483452",
    "active": "1",
    "name": "Theresa Hodkiewicz",
    "roleId": "4",
    "passwordHash": null,
    "supervisorId": "470910"
  },
  {
    "id": "450537",
    "active": "1",
    "name": "Anne Pfannerstill",
    "roleId": "4",
    "passwordHash": null,
    "supervisorId": "413921"
  },
  {
    "id": "428940",
    "active": "1",
    "name": "Dianna Kerluke",
    "roleId": "4",
    "passwordHash": null,
    "supervisorId": "480594"
  },
  {
    "id": "498153",
    "active": "1",
    "name": "Edmund Jaskolski",
    "roleId": "4",
    "passwordHash": null,
    "supervisorId": "481914"
  },
  {
    "id": "422902",
    "active": "1",
    "name": "Paula Nolan",
    "roleId": "4",
    "passwordHash": null,
    "supervisorId": "420434"
  },
  {
    "id": "491519",
    "active": "1",
    "name": "Tom Ward",
    "roleId": "4",
    "passwordHash": null,
    "supervisorId": "481914"
  },
  {
    "id": "472764",
    "active": "1",
    "name": "Angela Smith",
    "roleId": "4",
    "passwordHash": null,
    "supervisorId": "466663"
  },
  {
    "id": "417276",
    "active": "1",
    "name": "Darrel Reichert",
    "roleId": "4",
    "passwordHash": null,
    "supervisorId": "413921"
  },
  {
    "id": "469907",
    "active": "1",
    "name": "Hugh Gibson",
    "roleId": "4",
    "passwordHash": null,
    "supervisorId": "461692"
  },
  {
    "id": "439963",
    "active": "1",
    "name": "Devin Wuckert",
    "roleId": "4",
    "passwordHash": null,
    "supervisorId": "440247"
  },
  {
    "id": "425257",
    "active": "1",
    "name": "Bennie Cormier",
    "roleId": "4",
    "passwordHash": null,
    "supervisorId": "415516"
  }
];

const USER_DESIGNATIONS = [
  {
    "userId": "457042",
    "departmentId": "4",
    "jobId": "2"
  },
  {
    "userId": "478224",
    "departmentId": "5",
    "jobId": "2"
  },
  {
    "userId": "489776",
    "departmentId": "6",
    "jobId": "2"
  },
  {
    "userId": "432174",
    "departmentId": "4",
    "jobId": "5"
  },
  {
    "userId": "487742",
    "departmentId": "4",
    "jobId": "7"
  },
  {
    "userId": "456288",
    "departmentId": "6",
    "jobId": "6"
  },
  {
    "userId": "481914",
    "departmentId": "6",
    "jobId": "5"
  },
  {
    "userId": "491836",
    "departmentId": "4",
    "jobId": "7"
  },
  {
    "userId": "477513",
    "departmentId": "6",
    "jobId": "6"
  },
  {
    "userId": "470910",
    "departmentId": "6",
    "jobId": "6"
  },
  {
    "userId": "440247",
    "departmentId": "4",
    "jobId": "5"
  },
  {
    "userId": "416701",
    "departmentId": "4",
    "jobId": "5"
  },
  {
    "userId": "415516",
    "departmentId": "6",
    "jobId": "5"
  },
  {
    "userId": "413921",
    "departmentId": "4",
    "jobId": "7"
  },
  {
    "userId": "466663",
    "departmentId": "5",
    "jobId": "5"
  },
  {
    "userId": "467465",
    "departmentId": "6",
    "jobId": "6"
  },
  {
    "userId": "495207",
    "departmentId": "6",
    "jobId": "5"
  },
  {
    "userId": "480594",
    "departmentId": "5",
    "jobId": "6"
  },
  {
    "userId": "466236",
    "departmentId": "6",
    "jobId": "5"
  },
  {
    "userId": "429805",
    "departmentId": "4",
    "jobId": "7"
  },
  {
    "userId": "464458",
    "departmentId": "6",
    "jobId": "7"
  },
  {
    "userId": "461692",
    "departmentId": "6",
    "jobId": "7"
  },
  {
    "userId": "420434",
    "departmentId": "6",
    "jobId": "7"
  },
  {
    "userId": "414304",
    "departmentId": "4",
    "jobId": "9"
  },
  {
    "userId": "457252",
    "departmentId": "6",
    "jobId": "9"
  },
  {
    "userId": "492350",
    "departmentId": "4",
    "jobId": "8"
  },
  {
    "userId": "433683",
    "departmentId": "4",
    "jobId": "9"
  },
  {
    "userId": "459221",
    "departmentId": "4",
    "jobId": "8"
  },
  {
    "userId": "496680",
    "departmentId": "4",
    "jobId": "8"
  },
  {
    "userId": "438808",
    "departmentId": "6",
    "jobId": "8"
  },
  {
    "userId": "449483",
    "departmentId": "6",
    "jobId": "8"
  },
  {
    "userId": "478610",
    "departmentId": "6",
    "jobId": "8"
  },
  {
    "userId": "474376",
    "departmentId": "4",
    "jobId": "8"
  },
  {
    "userId": "429807",
    "departmentId": "4",
    "jobId": "8"
  },
  {
    "userId": "464591",
    "departmentId": "4",
    "jobId": "9"
  },
  {
    "userId": "442513",
    "departmentId": "5",
    "jobId": "9"
  },
  {
    "userId": "400746",
    "departmentId": "4",
    "jobId": "9"
  },
  {
    "userId": "499613",
    "departmentId": "6",
    "jobId": "8"
  },
  {
    "userId": "437426",
    "departmentId": "6",
    "jobId": "9"
  },
  {
    "userId": "431417",
    "departmentId": "4",
    "jobId": "8"
  },
  {
    "userId": "404058",
    "departmentId": "6",
    "jobId": "9"
  },
  {
    "userId": "491957",
    "departmentId": "5",
    "jobId": "9"
  },
  {
    "userId": "403436",
    "departmentId": "5",
    "jobId": "8"
  },
  {
    "userId": "451355",
    "departmentId": "4",
    "jobId": "9"
  },
  {
    "userId": "453318",
    "departmentId": "6",
    "jobId": "9"
  },
  {
    "userId": "403787",
    "departmentId": "4",
    "jobId": "8"
  },
  {
    "userId": "407376",
    "departmentId": "6",
    "jobId": "9"
  },
  {
    "userId": "492647",
    "departmentId": "6",
    "jobId": "9"
  },
  {
    "userId": "482950",
    "departmentId": "6",
    "jobId": "8"
  },
  {
    "userId": "410611",
    "departmentId": "6",
    "jobId": "9"
  },
  {
    "userId": "464649",
    "departmentId": "4",
    "jobId": "9"
  },
  {
    "userId": "424527",
    "departmentId": "4",
    "jobId": "9"
  },
  {
    "userId": "408311",
    "departmentId": "4",
    "jobId": "8"
  },
  {
    "userId": "419410",
    "departmentId": "4",
    "jobId": "8"
  },
  {
    "userId": "436952",
    "departmentId": "4",
    "jobId": "9"
  },
  {
    "userId": "421482",
    "departmentId": "6",
    "jobId": "8"
  },
  {
    "userId": "418419",
    "departmentId": "6",
    "jobId": "9"
  },
  {
    "userId": "418629",
    "departmentId": "6",
    "jobId": "8"
  },
  {
    "userId": "403829",
    "departmentId": "6",
    "jobId": "9"
  },
  {
    "userId": "468108",
    "departmentId": "5",
    "jobId": "8"
  },
  {
    "userId": "420488",
    "departmentId": "4",
    "jobId": "9"
  },
  {
    "userId": "453044",
    "departmentId": "6",
    "jobId": "8"
  },
  {
    "userId": "412578",
    "departmentId": "6",
    "jobId": "8"
  },
  {
    "userId": "428809",
    "departmentId": "4",
    "jobId": "8"
  },
  {
    "userId": "490709",
    "departmentId": "6",
    "jobId": "8"
  },
  {
    "userId": "498712",
    "departmentId": "6",
    "jobId": "8"
  },
  {
    "userId": "424177",
    "departmentId": "6",
    "jobId": "8"
  },
  {
    "userId": "483994",
    "departmentId": "6",
    "jobId": "9"
  },
  {
    "userId": "455415",
    "departmentId": "4",
    "jobId": "8"
  },
  {
    "userId": "443558",
    "departmentId": "6",
    "jobId": "8"
  },
  {
    "userId": "478049",
    "departmentId": "5",
    "jobId": "8"
  },
  {
    "userId": "474374",
    "departmentId": "6",
    "jobId": "9"
  },
  {
    "userId": "414452",
    "departmentId": "4",
    "jobId": "9"
  },
  {
    "userId": "430685",
    "departmentId": "6",
    "jobId": "9"
  },
  {
    "userId": "465209",
    "departmentId": "6",
    "jobId": "9"
  },
  {
    "userId": "434935",
    "departmentId": "6",
    "jobId": "9"
  },
  {
    "userId": "421014",
    "departmentId": "6",
    "jobId": "8"
  },
  {
    "userId": "440959",
    "departmentId": "6",
    "jobId": "8"
  },
  {
    "userId": "431865",
    "departmentId": "5",
    "jobId": "8"
  },
  {
    "userId": "483767",
    "departmentId": "6",
    "jobId": "9"
  },
  {
    "userId": "405855",
    "departmentId": "6",
    "jobId": "9"
  },
  {
    "userId": "471377",
    "departmentId": "5",
    "jobId": "8"
  },
  {
    "userId": "414031",
    "departmentId": "5",
    "jobId": "8"
  },
  {
    "userId": "491292",
    "departmentId": "4",
    "jobId": "8"
  },
  {
    "userId": "490351",
    "departmentId": "5",
    "jobId": "9"
  },
  {
    "userId": "461959",
    "departmentId": "6",
    "jobId": "9"
  },
  {
    "userId": "493432",
    "departmentId": "6",
    "jobId": "8"
  },
  {
    "userId": "457809",
    "departmentId": "6",
    "jobId": "8"
  },
  {
    "userId": "410063",
    "departmentId": "4",
    "jobId": "8"
  },
  {
    "userId": "483452",
    "departmentId": "6",
    "jobId": "8"
  },
  {
    "userId": "450537",
    "departmentId": "4",
    "jobId": "8"
  },
  {
    "userId": "428940",
    "departmentId": "5",
    "jobId": "9"
  },
  {
    "userId": "498153",
    "departmentId": "6",
    "jobId": "8"
  },
  {
    "userId": "422902",
    "departmentId": "6",
    "jobId": "8"
  },
  {
    "userId": "491519",
    "departmentId": "6",
    "jobId": "8"
  },
  {
    "userId": "472764",
    "departmentId": "5",
    "jobId": "8"
  },
  {
    "userId": "417276",
    "departmentId": "4",
    "jobId": "9"
  },
  {
    "userId": "469907",
    "departmentId": "6",
    "jobId": "9"
  },
  {
    "userId": "439963",
    "departmentId": "4",
    "jobId": "9"
  },
  {
    "userId": "425257",
    "departmentId": "6",
    "jobId": "8"
  }
];

const USER_SCHEDULES = [
  {
    "departmentId": "4",
    "userId": "457042",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Australia/Sydney",
    "clockIn": "05:30",
    "clockOut": "14:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"09:30\",\"endTime\":\"09:45\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"11:00\",\"endTime\":\"12:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"13:30\",\"endTime\":\"13:45\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "5",
    "userId": "478224",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "America/New_York",
    "clockIn": "15:30",
    "clockOut": "00:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"17:30\",\"endTime\":\"17:45\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"19:30\",\"endTime\":\"20:30\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"21:30\",\"endTime\":\"21:45\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "6",
    "userId": "489776",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Europe/London",
    "clockIn": "21:00",
    "clockOut": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "4",
    "userId": "432174",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Australia/Sydney",
    "clockIn": "05:30",
    "clockOut": "14:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"09:30\",\"endTime\":\"09:45\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"11:00\",\"endTime\":\"12:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"13:30\",\"endTime\":\"13:45\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "4",
    "userId": "487742",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Australia/Sydney",
    "clockIn": "05:30",
    "clockOut": "14:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"09:30\",\"endTime\":\"09:45\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"11:00\",\"endTime\":\"12:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"13:30\",\"endTime\":\"13:45\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "6",
    "userId": "456288",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Europe/London",
    "clockIn": "21:00",
    "clockOut": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "6",
    "userId": "481914",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Europe/London",
    "clockIn": "21:00",
    "clockOut": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "4",
    "userId": "491836",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Australia/Sydney",
    "clockIn": "05:30",
    "clockOut": "14:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"09:30\",\"endTime\":\"09:45\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"11:00\",\"endTime\":\"12:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"13:30\",\"endTime\":\"13:45\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "6",
    "userId": "477513",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Europe/London",
    "clockIn": "21:00",
    "clockOut": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "6",
    "userId": "470910",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Europe/London",
    "clockIn": "21:00",
    "clockOut": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "4",
    "userId": "440247",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Australia/Sydney",
    "clockIn": "05:30",
    "clockOut": "14:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"09:30\",\"endTime\":\"09:45\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"11:00\",\"endTime\":\"12:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"13:30\",\"endTime\":\"13:45\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "4",
    "userId": "416701",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Australia/Sydney",
    "clockIn": "05:30",
    "clockOut": "14:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"09:30\",\"endTime\":\"09:45\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"11:00\",\"endTime\":\"12:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"13:30\",\"endTime\":\"13:45\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "6",
    "userId": "415516",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Europe/London",
    "clockIn": "21:00",
    "clockOut": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "4",
    "userId": "413921",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Australia/Sydney",
    "clockIn": "05:30",
    "clockOut": "14:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"09:30\",\"endTime\":\"09:45\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"11:00\",\"endTime\":\"12:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"13:30\",\"endTime\":\"13:45\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "5",
    "userId": "466663",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "America/New_York",
    "clockIn": "15:30",
    "clockOut": "00:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"17:30\",\"endTime\":\"17:45\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"19:30\",\"endTime\":\"20:30\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"21:30\",\"endTime\":\"21:45\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "6",
    "userId": "467465",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Europe/London",
    "clockIn": "21:00",
    "clockOut": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "6",
    "userId": "495207",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Europe/London",
    "clockIn": "21:00",
    "clockOut": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "5",
    "userId": "480594",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "America/New_York",
    "clockIn": "15:30",
    "clockOut": "00:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"17:30\",\"endTime\":\"17:45\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"19:30\",\"endTime\":\"20:30\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"21:30\",\"endTime\":\"21:45\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "6",
    "userId": "466236",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Europe/London",
    "clockIn": "21:00",
    "clockOut": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "4",
    "userId": "429805",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Australia/Sydney",
    "clockIn": "05:30",
    "clockOut": "14:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"09:30\",\"endTime\":\"09:45\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"11:00\",\"endTime\":\"12:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"13:30\",\"endTime\":\"13:45\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "6",
    "userId": "464458",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Europe/London",
    "clockIn": "21:00",
    "clockOut": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "6",
    "userId": "461692",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Europe/London",
    "clockIn": "21:00",
    "clockOut": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "6",
    "userId": "420434",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Europe/London",
    "clockIn": "21:00",
    "clockOut": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "4",
    "userId": "414304",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Australia/Sydney",
    "clockIn": "05:30",
    "clockOut": "14:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"09:30\",\"endTime\":\"09:45\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"11:00\",\"endTime\":\"12:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"13:30\",\"endTime\":\"13:45\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "6",
    "userId": "457252",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Europe/London",
    "clockIn": "21:00",
    "clockOut": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "4",
    "userId": "492350",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Australia/Sydney",
    "clockIn": "05:30",
    "clockOut": "14:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"09:30\",\"endTime\":\"09:45\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"11:00\",\"endTime\":\"12:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"13:30\",\"endTime\":\"13:45\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "4",
    "userId": "433683",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Australia/Sydney",
    "clockIn": "05:30",
    "clockOut": "14:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"09:30\",\"endTime\":\"09:45\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"11:00\",\"endTime\":\"12:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"13:30\",\"endTime\":\"13:45\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "4",
    "userId": "459221",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Australia/Sydney",
    "clockIn": "05:30",
    "clockOut": "14:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"09:30\",\"endTime\":\"09:45\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"11:00\",\"endTime\":\"12:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"13:30\",\"endTime\":\"13:45\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "4",
    "userId": "496680",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Australia/Sydney",
    "clockIn": "05:30",
    "clockOut": "14:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"09:30\",\"endTime\":\"09:45\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"11:00\",\"endTime\":\"12:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"13:30\",\"endTime\":\"13:45\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "6",
    "userId": "438808",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Europe/London",
    "clockIn": "21:00",
    "clockOut": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "6",
    "userId": "449483",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Europe/London",
    "clockIn": "21:00",
    "clockOut": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "6",
    "userId": "478610",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Europe/London",
    "clockIn": "21:00",
    "clockOut": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "4",
    "userId": "474376",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Australia/Sydney",
    "clockIn": "05:30",
    "clockOut": "14:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"09:30\",\"endTime\":\"09:45\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"11:00\",\"endTime\":\"12:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"13:30\",\"endTime\":\"13:45\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "4",
    "userId": "429807",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Australia/Sydney",
    "clockIn": "05:30",
    "clockOut": "14:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"09:30\",\"endTime\":\"09:45\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"11:00\",\"endTime\":\"12:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"13:30\",\"endTime\":\"13:45\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "4",
    "userId": "464591",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Australia/Sydney",
    "clockIn": "05:30",
    "clockOut": "14:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"09:30\",\"endTime\":\"09:45\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"11:00\",\"endTime\":\"12:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"13:30\",\"endTime\":\"13:45\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "5",
    "userId": "442513",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "America/New_York",
    "clockIn": "15:30",
    "clockOut": "00:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"17:30\",\"endTime\":\"17:45\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"19:30\",\"endTime\":\"20:30\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"21:30\",\"endTime\":\"21:45\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "4",
    "userId": "400746",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Australia/Sydney",
    "clockIn": "05:30",
    "clockOut": "14:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"09:30\",\"endTime\":\"09:45\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"11:00\",\"endTime\":\"12:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"13:30\",\"endTime\":\"13:45\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "6",
    "userId": "499613",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Europe/London",
    "clockIn": "21:00",
    "clockOut": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "6",
    "userId": "437426",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Europe/London",
    "clockIn": "21:00",
    "clockOut": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "4",
    "userId": "431417",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Australia/Sydney",
    "clockIn": "05:30",
    "clockOut": "14:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"09:30\",\"endTime\":\"09:45\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"11:00\",\"endTime\":\"12:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"13:30\",\"endTime\":\"13:45\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "6",
    "userId": "404058",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Europe/London",
    "clockIn": "21:00",
    "clockOut": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "5",
    "userId": "491957",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "America/New_York",
    "clockIn": "15:30",
    "clockOut": "00:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"17:30\",\"endTime\":\"17:45\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"19:30\",\"endTime\":\"20:30\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"21:30\",\"endTime\":\"21:45\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "5",
    "userId": "403436",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "America/New_York",
    "clockIn": "15:30",
    "clockOut": "00:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"17:30\",\"endTime\":\"17:45\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"19:30\",\"endTime\":\"20:30\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"21:30\",\"endTime\":\"21:45\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "4",
    "userId": "451355",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Australia/Sydney",
    "clockIn": "05:30",
    "clockOut": "14:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"09:30\",\"endTime\":\"09:45\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"11:00\",\"endTime\":\"12:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"13:30\",\"endTime\":\"13:45\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "6",
    "userId": "453318",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Europe/London",
    "clockIn": "21:00",
    "clockOut": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "4",
    "userId": "403787",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Australia/Sydney",
    "clockIn": "05:30",
    "clockOut": "14:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"09:30\",\"endTime\":\"09:45\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"11:00\",\"endTime\":\"12:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"13:30\",\"endTime\":\"13:45\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "6",
    "userId": "407376",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Europe/London",
    "clockIn": "21:00",
    "clockOut": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "6",
    "userId": "492647",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Europe/London",
    "clockIn": "21:00",
    "clockOut": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "6",
    "userId": "482950",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Europe/London",
    "clockIn": "21:00",
    "clockOut": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "6",
    "userId": "410611",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Europe/London",
    "clockIn": "21:00",
    "clockOut": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "4",
    "userId": "464649",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Australia/Sydney",
    "clockIn": "05:30",
    "clockOut": "14:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"09:30\",\"endTime\":\"09:45\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"11:00\",\"endTime\":\"12:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"13:30\",\"endTime\":\"13:45\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "4",
    "userId": "424527",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Australia/Sydney",
    "clockIn": "05:30",
    "clockOut": "14:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"09:30\",\"endTime\":\"09:45\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"11:00\",\"endTime\":\"12:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"13:30\",\"endTime\":\"13:45\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "4",
    "userId": "408311",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Australia/Sydney",
    "clockIn": "05:30",
    "clockOut": "14:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"09:30\",\"endTime\":\"09:45\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"11:00\",\"endTime\":\"12:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"13:30\",\"endTime\":\"13:45\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "4",
    "userId": "419410",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Australia/Sydney",
    "clockIn": "05:30",
    "clockOut": "14:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"09:30\",\"endTime\":\"09:45\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"11:00\",\"endTime\":\"12:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"13:30\",\"endTime\":\"13:45\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "4",
    "userId": "436952",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Australia/Sydney",
    "clockIn": "05:30",
    "clockOut": "14:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"09:30\",\"endTime\":\"09:45\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"11:00\",\"endTime\":\"12:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"13:30\",\"endTime\":\"13:45\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "6",
    "userId": "421482",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Europe/London",
    "clockIn": "21:00",
    "clockOut": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "6",
    "userId": "418419",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Europe/London",
    "clockIn": "21:00",
    "clockOut": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "6",
    "userId": "418629",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Europe/London",
    "clockIn": "21:00",
    "clockOut": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "6",
    "userId": "403829",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Europe/London",
    "clockIn": "21:00",
    "clockOut": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "5",
    "userId": "468108",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "America/New_York",
    "clockIn": "15:30",
    "clockOut": "00:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"17:30\",\"endTime\":\"17:45\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"19:30\",\"endTime\":\"20:30\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"21:30\",\"endTime\":\"21:45\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "4",
    "userId": "420488",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Australia/Sydney",
    "clockIn": "05:30",
    "clockOut": "14:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"09:30\",\"endTime\":\"09:45\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"11:00\",\"endTime\":\"12:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"13:30\",\"endTime\":\"13:45\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "6",
    "userId": "453044",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Europe/London",
    "clockIn": "21:00",
    "clockOut": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "6",
    "userId": "412578",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Europe/London",
    "clockIn": "21:00",
    "clockOut": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "4",
    "userId": "428809",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Australia/Sydney",
    "clockIn": "05:30",
    "clockOut": "14:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"09:30\",\"endTime\":\"09:45\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"11:00\",\"endTime\":\"12:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"13:30\",\"endTime\":\"13:45\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "6",
    "userId": "490709",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Europe/London",
    "clockIn": "21:00",
    "clockOut": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "6",
    "userId": "498712",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Europe/London",
    "clockIn": "21:00",
    "clockOut": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "6",
    "userId": "424177",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Europe/London",
    "clockIn": "21:00",
    "clockOut": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "6",
    "userId": "483994",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Europe/London",
    "clockIn": "21:00",
    "clockOut": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "4",
    "userId": "455415",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Australia/Sydney",
    "clockIn": "05:30",
    "clockOut": "14:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"09:30\",\"endTime\":\"09:45\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"11:00\",\"endTime\":\"12:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"13:30\",\"endTime\":\"13:45\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "6",
    "userId": "443558",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Europe/London",
    "clockIn": "21:00",
    "clockOut": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "5",
    "userId": "478049",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "America/New_York",
    "clockIn": "15:30",
    "clockOut": "00:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"17:30\",\"endTime\":\"17:45\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"19:30\",\"endTime\":\"20:30\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"21:30\",\"endTime\":\"21:45\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "6",
    "userId": "474374",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Europe/London",
    "clockIn": "21:00",
    "clockOut": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "4",
    "userId": "414452",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Australia/Sydney",
    "clockIn": "05:30",
    "clockOut": "14:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"09:30\",\"endTime\":\"09:45\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"11:00\",\"endTime\":\"12:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"13:30\",\"endTime\":\"13:45\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "6",
    "userId": "430685",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Europe/London",
    "clockIn": "21:00",
    "clockOut": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "6",
    "userId": "465209",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Europe/London",
    "clockIn": "21:00",
    "clockOut": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "6",
    "userId": "434935",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Europe/London",
    "clockIn": "21:00",
    "clockOut": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "6",
    "userId": "421014",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Europe/London",
    "clockIn": "21:00",
    "clockOut": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "6",
    "userId": "440959",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Europe/London",
    "clockIn": "21:00",
    "clockOut": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "5",
    "userId": "431865",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "America/New_York",
    "clockIn": "15:30",
    "clockOut": "00:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"17:30\",\"endTime\":\"17:45\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"19:30\",\"endTime\":\"20:30\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"21:30\",\"endTime\":\"21:45\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "6",
    "userId": "483767",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Europe/London",
    "clockIn": "21:00",
    "clockOut": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "6",
    "userId": "405855",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Europe/London",
    "clockIn": "21:00",
    "clockOut": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "5",
    "userId": "471377",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "America/New_York",
    "clockIn": "15:30",
    "clockOut": "00:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"17:30\",\"endTime\":\"17:45\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"19:30\",\"endTime\":\"20:30\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"21:30\",\"endTime\":\"21:45\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "5",
    "userId": "414031",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "America/New_York",
    "clockIn": "15:30",
    "clockOut": "00:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"17:30\",\"endTime\":\"17:45\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"19:30\",\"endTime\":\"20:30\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"21:30\",\"endTime\":\"21:45\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "4",
    "userId": "491292",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Australia/Sydney",
    "clockIn": "05:30",
    "clockOut": "14:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"09:30\",\"endTime\":\"09:45\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"11:00\",\"endTime\":\"12:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"13:30\",\"endTime\":\"13:45\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "5",
    "userId": "490351",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "America/New_York",
    "clockIn": "15:30",
    "clockOut": "00:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"17:30\",\"endTime\":\"17:45\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"19:30\",\"endTime\":\"20:30\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"21:30\",\"endTime\":\"21:45\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "6",
    "userId": "461959",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Europe/London",
    "clockIn": "21:00",
    "clockOut": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "6",
    "userId": "493432",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Europe/London",
    "clockIn": "21:00",
    "clockOut": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "6",
    "userId": "457809",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Europe/London",
    "clockIn": "21:00",
    "clockOut": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "4",
    "userId": "410063",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Australia/Sydney",
    "clockIn": "05:30",
    "clockOut": "14:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"09:30\",\"endTime\":\"09:45\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"11:00\",\"endTime\":\"12:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"13:30\",\"endTime\":\"13:45\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "6",
    "userId": "483452",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Europe/London",
    "clockIn": "21:00",
    "clockOut": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "4",
    "userId": "450537",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Australia/Sydney",
    "clockIn": "05:30",
    "clockOut": "14:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"09:30\",\"endTime\":\"09:45\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"11:00\",\"endTime\":\"12:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"13:30\",\"endTime\":\"13:45\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "5",
    "userId": "428940",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "America/New_York",
    "clockIn": "15:30",
    "clockOut": "00:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"17:30\",\"endTime\":\"17:45\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"19:30\",\"endTime\":\"20:30\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"21:30\",\"endTime\":\"21:45\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "6",
    "userId": "498153",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Europe/London",
    "clockIn": "21:00",
    "clockOut": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "6",
    "userId": "422902",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Europe/London",
    "clockIn": "21:00",
    "clockOut": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "6",
    "userId": "491519",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Europe/London",
    "clockIn": "21:00",
    "clockOut": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "5",
    "userId": "472764",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "America/New_York",
    "clockIn": "15:30",
    "clockOut": "00:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"17:30\",\"endTime\":\"17:45\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"19:30\",\"endTime\":\"20:30\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"21:30\",\"endTime\":\"21:45\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "4",
    "userId": "417276",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Australia/Sydney",
    "clockIn": "05:30",
    "clockOut": "14:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"09:30\",\"endTime\":\"09:45\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"11:00\",\"endTime\":\"12:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"13:30\",\"endTime\":\"13:45\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "6",
    "userId": "469907",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Europe/London",
    "clockIn": "21:00",
    "clockOut": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "4",
    "userId": "439963",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Australia/Sydney",
    "clockIn": "05:30",
    "clockOut": "14:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"09:30\",\"endTime\":\"09:45\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"11:00\",\"endTime\":\"12:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"13:30\",\"endTime\":\"13:45\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "departmentId": "6",
    "userId": "425257",
    "startDate": "2025-10-09",
    "userTimzone": "Asia/Manila",
    "clientTimzone": "Europe/London",
    "clockIn": "21:00",
    "clockOut": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"durationMin\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"durationMin\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"durationMin\":\"15\",\"description\":\"Second Break\"}]"
  }
];

export async function setDummyData(fetch: SvelteFetch) {
  const { data, error } = await hashPassword(fetch, PASSWORD);

  if (error || !data) {
    throw new Error("Failed to create dummy password");
  }
  const validUsers = z.array(createInsertSchema(tblUsers)).safeParse(USERS.map(user => Object.assign(user, { passwordHash: data })));
  const validDesignation = z.array(createInsertSchema(tblUserDesignation)).safeParse(USER_DESIGNATIONS);
  const validSchedule = z.array(createInsertSchema(tblUserSchedule)).safeParse(USER_SCHEDULES);

  if (validUsers.success && validDesignation.success && validSchedule.success) {
    try {
      await db.transaction(async (tx) => {
        const dbUsers = await tx.select().from(tblUsers).where(eq(tblUsers.id, validUsers.data[0].id ?? 0))
        if (dbUsers.length) {
          tx.rollback();
        }
        await tx.insert(tblUsers).values(validUsers.data);
        await tx.insert(tblUserDesignation).values(validDesignation.data);
        await tx.insert(tblUserSchedule).values(validSchedule.data)
      })
    } catch (err) {
      console.error(err)
    }
  } else {
    console.error('Validation failed:', {
      users: validUsers.error,
      designation: validDesignation.error,
      schedule: validSchedule.error
    });
  }
}