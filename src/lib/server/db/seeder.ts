import { createSchemaFactory } from "drizzle-zod";
import { db } from "$lib/server/db";
import { tblUserDesignation, tblUsers, tblUserSchedule } from './schema';
import { hashPassword } from "../controller/auth";
import type { SvelteFetch } from "$lib/app-types";

const PASSWORD = 'pa55word'
const { createInsertSchema } = createSchemaFactory({ coerce: true });
const USERS = [
  {
    "id": "457042",
    "active": "1",
    "name": "Sherry Hyatt",
    "role_id": "5",
    "password_hash": null,
    "supervisor_id": null
  },
  {
    "id": "478224",
    "active": "1",
    "name": "Candace Doyle",
    "role_id": "5",
    "password_hash": null,
    "supervisor_id": null
  },
  {
    "id": "489776",
    "active": "1",
    "name": "Franklin Weimann",
    "role_id": "5",
    "password_hash": null,
    "supervisor_id": null
  },
  {
    "id": "432174",
    "active": "1",
    "name": "Mr. Ignacio Tremblay",
    "role_id": "6",
    "password_hash": null,
    "supervisor_id": "457042"
  },
  {
    "id": "487742",
    "active": "1",
    "name": "Raul Williamson",
    "role_id": "8",
    "password_hash": null,
    "supervisor_id": "457042"
  },
  {
    "id": "456288",
    "active": "1",
    "name": "Rafael Barton",
    "role_id": "7",
    "password_hash": null,
    "supervisor_id": "489776"
  },
  {
    "id": "481914",
    "active": "1",
    "name": "Julie King",
    "role_id": "6",
    "password_hash": null,
    "supervisor_id": "489776"
  },
  {
    "id": "491836",
    "active": "1",
    "name": "Carolyn Von",
    "role_id": "8",
    "password_hash": null,
    "supervisor_id": "457042"
  },
  {
    "id": "477513",
    "active": "1",
    "name": "Steve McKenzie-Gibson",
    "role_id": "7",
    "password_hash": null,
    "supervisor_id": "489776"
  },
  {
    "id": "470910",
    "active": "1",
    "name": "Matthew Leuschke",
    "role_id": "7",
    "password_hash": null,
    "supervisor_id": "489776"
  },
  {
    "id": "440247",
    "active": "1",
    "name": "Dave King",
    "role_id": "6",
    "password_hash": null,
    "supervisor_id": "457042"
  },
  {
    "id": "416701",
    "active": "1",
    "name": "Yvonne Rolfson",
    "role_id": "6",
    "password_hash": null,
    "supervisor_id": "457042"
  },
  {
    "id": "415516",
    "active": "1",
    "name": "Jacquelyn Hermiston DDS",
    "role_id": "6",
    "password_hash": null,
    "supervisor_id": "489776"
  },
  {
    "id": "413921",
    "active": "1",
    "name": "Adrienne Bergnaum",
    "role_id": "8",
    "password_hash": null,
    "supervisor_id": "457042"
  },
  {
    "id": "466663",
    "active": "1",
    "name": "Dr. Perry Abernathy",
    "role_id": "6",
    "password_hash": null,
    "supervisor_id": "478224"
  },
  {
    "id": "467465",
    "active": "1",
    "name": "Laverne Mueller",
    "role_id": "7",
    "password_hash": null,
    "supervisor_id": "489776"
  },
  {
    "id": "495207",
    "active": "1",
    "name": "Tanya Roberts I",
    "role_id": "6",
    "password_hash": null,
    "supervisor_id": "489776"
  },
  {
    "id": "480594",
    "active": "1",
    "name": "Matthew Leannon",
    "role_id": "7",
    "password_hash": null,
    "supervisor_id": "478224"
  },
  {
    "id": "466236",
    "active": "1",
    "name": "Christie Lind",
    "role_id": "6",
    "password_hash": null,
    "supervisor_id": "489776"
  },
  {
    "id": "429805",
    "active": "1",
    "name": "Salvador Johnson-MacGyver",
    "role_id": "8",
    "password_hash": null,
    "supervisor_id": "457042"
  },
  {
    "id": "464458",
    "active": "1",
    "name": "Kristin Rolfson",
    "role_id": "8",
    "password_hash": null,
    "supervisor_id": "489776"
  },
  {
    "id": "461692",
    "active": "1",
    "name": "Mr. Kevin Breitenberg",
    "role_id": "8",
    "password_hash": null,
    "supervisor_id": "489776"
  },
  {
    "id": "420434",
    "active": "1",
    "name": "Faith Mante",
    "role_id": "8",
    "password_hash": null,
    "supervisor_id": "489776"
  },
  {
    "id": "414304",
    "active": "1",
    "name": "Roberto Beatty-Stamm",
    "role_id": "3",
    "password_hash": null,
    "supervisor_id": "491836"
  },
  {
    "id": "457252",
    "active": "1",
    "name": "Marianne O'Conner",
    "role_id": "3",
    "password_hash": null,
    "supervisor_id": "467465"
  },
  {
    "id": "492350",
    "active": "1",
    "name": "Aubrey McClure",
    "role_id": "3",
    "password_hash": null,
    "supervisor_id": "416701"
  },
  {
    "id": "433683",
    "active": "1",
    "name": "Kelly Runolfsdottir",
    "role_id": "3",
    "password_hash": null,
    "supervisor_id": "429805"
  },
  {
    "id": "459221",
    "active": "1",
    "name": "Monica Schneider",
    "role_id": "3",
    "password_hash": null,
    "supervisor_id": "491836"
  },
  {
    "id": "496680",
    "active": "1",
    "name": "Cathy Rempel",
    "role_id": "3",
    "password_hash": null,
    "supervisor_id": "432174"
  },
  {
    "id": "438808",
    "active": "1",
    "name": "Kim Morissette",
    "role_id": "3",
    "password_hash": null,
    "supervisor_id": "461692"
  },
  {
    "id": "449483",
    "active": "1",
    "name": "Clay Grimes",
    "role_id": "3",
    "password_hash": null,
    "supervisor_id": "477513"
  },
  {
    "id": "478610",
    "active": "1",
    "name": "Elsie Windler",
    "role_id": "3",
    "password_hash": null,
    "supervisor_id": "461692"
  },
  {
    "id": "474376",
    "active": "1",
    "name": "Ms. Joy Willms",
    "role_id": "3",
    "password_hash": null,
    "supervisor_id": "487742"
  },
  {
    "id": "429807",
    "active": "1",
    "name": "Casey Grady II",
    "role_id": "3",
    "password_hash": null,
    "supervisor_id": "491836"
  },
  {
    "id": "464591",
    "active": "1",
    "name": "Miss Jessie Hegmann",
    "role_id": "3",
    "password_hash": null,
    "supervisor_id": "413921"
  },
  {
    "id": "442513",
    "active": "1",
    "name": "Dr. Manuel Franey",
    "role_id": "3",
    "password_hash": null,
    "supervisor_id": "480594"
  },
  {
    "id": "400746",
    "active": "1",
    "name": "Rene Beahan",
    "role_id": "3",
    "password_hash": null,
    "supervisor_id": "440247"
  },
  {
    "id": "499613",
    "active": "1",
    "name": "Jan Hodkiewicz",
    "role_id": "3",
    "password_hash": null,
    "supervisor_id": "470910"
  },
  {
    "id": "437426",
    "active": "1",
    "name": "Greg Prohaska",
    "role_id": "3",
    "password_hash": null,
    "supervisor_id": "456288"
  },
  {
    "id": "431417",
    "active": "1",
    "name": "Ervin Hand",
    "role_id": "3",
    "password_hash": null,
    "supervisor_id": "429805"
  },
  {
    "id": "404058",
    "active": "1",
    "name": "Nora Christiansen",
    "role_id": "3",
    "password_hash": null,
    "supervisor_id": "495207"
  },
  {
    "id": "491957",
    "active": "1",
    "name": "Kristin Heathcote",
    "role_id": "3",
    "password_hash": null,
    "supervisor_id": "480594"
  },
  {
    "id": "403436",
    "active": "1",
    "name": "Miss Margaret Gusikowski",
    "role_id": "3",
    "password_hash": null,
    "supervisor_id": "480594"
  },
  {
    "id": "451355",
    "active": "1",
    "name": "Mitchell Aufderhar",
    "role_id": "3",
    "password_hash": null,
    "supervisor_id": "491836"
  },
  {
    "id": "453318",
    "active": "1",
    "name": "Dennis Wunsch",
    "role_id": "3",
    "password_hash": null,
    "supervisor_id": "466236"
  },
  {
    "id": "403787",
    "active": "1",
    "name": "Sean Ledner",
    "role_id": "3",
    "password_hash": null,
    "supervisor_id": "487742"
  },
  {
    "id": "407376",
    "active": "1",
    "name": "Silvia Vandervort",
    "role_id": "3",
    "password_hash": null,
    "supervisor_id": "420434"
  },
  {
    "id": "492647",
    "active": "1",
    "name": "William Lakin",
    "role_id": "3",
    "password_hash": null,
    "supervisor_id": "466236"
  },
  {
    "id": "482950",
    "active": "1",
    "name": "Ms. Alice Larson",
    "role_id": "3",
    "password_hash": null,
    "supervisor_id": "495207"
  },
  {
    "id": "410611",
    "active": "1",
    "name": "Billy Rolfson-Considine",
    "role_id": "3",
    "password_hash": null,
    "supervisor_id": "467465"
  },
  {
    "id": "464649",
    "active": "1",
    "name": "Cristina Sporer",
    "role_id": "3",
    "password_hash": null,
    "supervisor_id": "440247"
  },
  {
    "id": "424527",
    "active": "1",
    "name": "Tommy Beahan",
    "role_id": "3",
    "password_hash": null,
    "supervisor_id": "413921"
  },
  {
    "id": "408311",
    "active": "1",
    "name": "Myron Reynolds-Gutmann",
    "role_id": "3",
    "password_hash": null,
    "supervisor_id": "432174"
  },
  {
    "id": "419410",
    "active": "1",
    "name": "Arnold Sawayn",
    "role_id": "3",
    "password_hash": null,
    "supervisor_id": "491836"
  },
  {
    "id": "436952",
    "active": "1",
    "name": "Nathaniel Wintheiser-Nienow",
    "role_id": "3",
    "password_hash": null,
    "supervisor_id": "413921"
  },
  {
    "id": "421482",
    "active": "1",
    "name": "Gretchen Lesch",
    "role_id": "3",
    "password_hash": null,
    "supervisor_id": "466236"
  },
  {
    "id": "418419",
    "active": "1",
    "name": "Abraham Pollich",
    "role_id": "3",
    "password_hash": null,
    "supervisor_id": "477513"
  },
  {
    "id": "418629",
    "active": "1",
    "name": "Hazel Fahey",
    "role_id": "3",
    "password_hash": null,
    "supervisor_id": "420434"
  },
  {
    "id": "403829",
    "active": "1",
    "name": "Connie Schmeler",
    "role_id": "3",
    "password_hash": null,
    "supervisor_id": "415516"
  },
  {
    "id": "468108",
    "active": "1",
    "name": "Mattie Schaefer",
    "role_id": "3",
    "password_hash": null,
    "supervisor_id": "466663"
  },
  {
    "id": "420488",
    "active": "1",
    "name": "Malcolm Kohler",
    "role_id": "3",
    "password_hash": null,
    "supervisor_id": "413921"
  },
  {
    "id": "453044",
    "active": "1",
    "name": "Ana Schultz",
    "role_id": "3",
    "password_hash": null,
    "supervisor_id": "466236"
  },
  {
    "id": "412578",
    "active": "1",
    "name": "Dr. Ellis Keebler",
    "role_id": "3",
    "password_hash": null,
    "supervisor_id": "456288"
  },
  {
    "id": "428809",
    "active": "1",
    "name": "Stephen Koch",
    "role_id": "3",
    "password_hash": null,
    "supervisor_id": "491836"
  },
  {
    "id": "490709",
    "active": "1",
    "name": "Jake Wunsch",
    "role_id": "3",
    "password_hash": null,
    "supervisor_id": "456288"
  },
  {
    "id": "498712",
    "active": "1",
    "name": "Mr. Bert Bashirian-O'Keefe",
    "role_id": "3",
    "password_hash": null,
    "supervisor_id": "466236"
  },
  {
    "id": "424177",
    "active": "1",
    "name": "Debbie Sanford-Ullrich DDS",
    "role_id": "3",
    "password_hash": null,
    "supervisor_id": "477513"
  },
  {
    "id": "483994",
    "active": "1",
    "name": "Evan Ullrich",
    "role_id": "3",
    "password_hash": null,
    "supervisor_id": "461692"
  },
  {
    "id": "455415",
    "active": "1",
    "name": "Becky Nikolaus",
    "role_id": "3",
    "password_hash": null,
    "supervisor_id": "491836"
  },
  {
    "id": "443558",
    "active": "1",
    "name": "Owen Hagenes",
    "role_id": "3",
    "password_hash": null,
    "supervisor_id": "420434"
  },
  {
    "id": "478049",
    "active": "1",
    "name": "Lawrence Waelchi",
    "role_id": "3",
    "password_hash": null,
    "supervisor_id": "466663"
  },
  {
    "id": "474374",
    "active": "1",
    "name": "Raquel Balistreri",
    "role_id": "3",
    "password_hash": null,
    "supervisor_id": "420434"
  },
  {
    "id": "414452",
    "active": "1",
    "name": "Edwin Thompson",
    "role_id": "3",
    "password_hash": null,
    "supervisor_id": "440247"
  },
  {
    "id": "430685",
    "active": "1",
    "name": "Felix Von",
    "role_id": "3",
    "password_hash": null,
    "supervisor_id": "466236"
  },
  {
    "id": "465209",
    "active": "1",
    "name": "Kirk Hoeger MD",
    "role_id": "3",
    "password_hash": null,
    "supervisor_id": "477513"
  },
  {
    "id": "434935",
    "active": "1",
    "name": "Janis Brakus",
    "role_id": "3",
    "password_hash": null,
    "supervisor_id": "420434"
  },
  {
    "id": "421014",
    "active": "1",
    "name": "Kirk Heller",
    "role_id": "3",
    "password_hash": null,
    "supervisor_id": "470910"
  },
  {
    "id": "440959",
    "active": "1",
    "name": "Craig McCullough",
    "role_id": "3",
    "password_hash": null,
    "supervisor_id": "477513"
  },
  {
    "id": "431865",
    "active": "1",
    "name": "Gwen Mertz",
    "role_id": "3",
    "password_hash": null,
    "supervisor_id": "480594"
  },
  {
    "id": "483767",
    "active": "1",
    "name": "Erin Mitchell-Cummings DVM",
    "role_id": "3",
    "password_hash": null,
    "supervisor_id": "495207"
  },
  {
    "id": "405855",
    "active": "1",
    "name": "Minnie Ankunding II",
    "role_id": "3",
    "password_hash": null,
    "supervisor_id": "470910"
  },
  {
    "id": "471377",
    "active": "1",
    "name": "Adam Anderson",
    "role_id": "3",
    "password_hash": null,
    "supervisor_id": "466663"
  },
  {
    "id": "414031",
    "active": "1",
    "name": "Cecilia Bashirian",
    "role_id": "3",
    "password_hash": null,
    "supervisor_id": "480594"
  },
  {
    "id": "491292",
    "active": "1",
    "name": "Neal Russel",
    "role_id": "3",
    "password_hash": null,
    "supervisor_id": "432174"
  },
  {
    "id": "490351",
    "active": "1",
    "name": "Camille Price",
    "role_id": "3",
    "password_hash": null,
    "supervisor_id": "466663"
  },
  {
    "id": "461959",
    "active": "1",
    "name": "Lydia Stokes",
    "role_id": "3",
    "password_hash": null,
    "supervisor_id": "495207"
  },
  {
    "id": "493432",
    "active": "1",
    "name": "Wilma Schoen",
    "role_id": "3",
    "password_hash": null,
    "supervisor_id": "466236"
  },
  {
    "id": "457809",
    "active": "1",
    "name": "Lucille Ryan",
    "role_id": "3",
    "password_hash": null,
    "supervisor_id": "456288"
  },
  {
    "id": "410063",
    "active": "1",
    "name": "Harvey Wolf",
    "role_id": "3",
    "password_hash": null,
    "supervisor_id": "440247"
  },
  {
    "id": "483452",
    "active": "1",
    "name": "Theresa Hodkiewicz",
    "role_id": "3",
    "password_hash": null,
    "supervisor_id": "470910"
  },
  {
    "id": "450537",
    "active": "1",
    "name": "Anne Pfannerstill",
    "role_id": "3",
    "password_hash": null,
    "supervisor_id": "413921"
  },
  {
    "id": "428940",
    "active": "1",
    "name": "Dianna Kerluke",
    "role_id": "3",
    "password_hash": null,
    "supervisor_id": "480594"
  },
  {
    "id": "498153",
    "active": "1",
    "name": "Edmund Jaskolski",
    "role_id": "3",
    "password_hash": null,
    "supervisor_id": "481914"
  },
  {
    "id": "422902",
    "active": "1",
    "name": "Paula Nolan",
    "role_id": "3",
    "password_hash": null,
    "supervisor_id": "420434"
  },
  {
    "id": "491519",
    "active": "1",
    "name": "Tom Ward",
    "role_id": "3",
    "password_hash": null,
    "supervisor_id": "481914"
  },
  {
    "id": "472764",
    "active": "1",
    "name": "Angela Smith",
    "role_id": "3",
    "password_hash": null,
    "supervisor_id": "466663"
  },
  {
    "id": "417276",
    "active": "1",
    "name": "Darrel Reichert",
    "role_id": "3",
    "password_hash": null,
    "supervisor_id": "413921"
  },
  {
    "id": "469907",
    "active": "1",
    "name": "Hugh Gibson",
    "role_id": "3",
    "password_hash": null,
    "supervisor_id": "461692"
  },
  {
    "id": "439963",
    "active": "1",
    "name": "Devin Wuckert",
    "role_id": "3",
    "password_hash": null,
    "supervisor_id": "440247"
  },
  {
    "id": "425257",
    "active": "1",
    "name": "Bennie Cormier",
    "role_id": "3",
    "password_hash": null,
    "supervisor_id": "415516"
  }
];

const USER_DESIGNATIONS = [
  {
    "user_id": "457042",
    "department_id": "4",
    "job_id": "2"
  },
  {
    "user_id": "478224",
    "department_id": "5",
    "job_id": "2"
  },
  {
    "user_id": "489776",
    "department_id": "6",
    "job_id": "2"
  },
  {
    "user_id": "432174",
    "department_id": "4",
    "job_id": "5"
  },
  {
    "user_id": "487742",
    "department_id": "4",
    "job_id": "7"
  },
  {
    "user_id": "456288",
    "department_id": "6",
    "job_id": "6"
  },
  {
    "user_id": "481914",
    "department_id": "6",
    "job_id": "5"
  },
  {
    "user_id": "491836",
    "department_id": "4",
    "job_id": "7"
  },
  {
    "user_id": "477513",
    "department_id": "6",
    "job_id": "6"
  },
  {
    "user_id": "470910",
    "department_id": "6",
    "job_id": "6"
  },
  {
    "user_id": "440247",
    "department_id": "4",
    "job_id": "5"
  },
  {
    "user_id": "416701",
    "department_id": "4",
    "job_id": "5"
  },
  {
    "user_id": "415516",
    "department_id": "6",
    "job_id": "5"
  },
  {
    "user_id": "413921",
    "department_id": "4",
    "job_id": "7"
  },
  {
    "user_id": "466663",
    "department_id": "5",
    "job_id": "5"
  },
  {
    "user_id": "467465",
    "department_id": "6",
    "job_id": "6"
  },
  {
    "user_id": "495207",
    "department_id": "6",
    "job_id": "5"
  },
  {
    "user_id": "480594",
    "department_id": "5",
    "job_id": "6"
  },
  {
    "user_id": "466236",
    "department_id": "6",
    "job_id": "5"
  },
  {
    "user_id": "429805",
    "department_id": "4",
    "job_id": "7"
  },
  {
    "user_id": "464458",
    "department_id": "6",
    "job_id": "7"
  },
  {
    "user_id": "461692",
    "department_id": "6",
    "job_id": "7"
  },
  {
    "user_id": "420434",
    "department_id": "6",
    "job_id": "7"
  },
  {
    "user_id": "414304",
    "department_id": "4",
    "job_id": "9"
  },
  {
    "user_id": "457252",
    "department_id": "6",
    "job_id": "9"
  },
  {
    "user_id": "492350",
    "department_id": "4",
    "job_id": "8"
  },
  {
    "user_id": "433683",
    "department_id": "4",
    "job_id": "9"
  },
  {
    "user_id": "459221",
    "department_id": "4",
    "job_id": "8"
  },
  {
    "user_id": "496680",
    "department_id": "4",
    "job_id": "8"
  },
  {
    "user_id": "438808",
    "department_id": "6",
    "job_id": "8"
  },
  {
    "user_id": "449483",
    "department_id": "6",
    "job_id": "8"
  },
  {
    "user_id": "478610",
    "department_id": "6",
    "job_id": "8"
  },
  {
    "user_id": "474376",
    "department_id": "4",
    "job_id": "8"
  },
  {
    "user_id": "429807",
    "department_id": "4",
    "job_id": "8"
  },
  {
    "user_id": "464591",
    "department_id": "4",
    "job_id": "9"
  },
  {
    "user_id": "442513",
    "department_id": "5",
    "job_id": "9"
  },
  {
    "user_id": "400746",
    "department_id": "4",
    "job_id": "9"
  },
  {
    "user_id": "499613",
    "department_id": "6",
    "job_id": "8"
  },
  {
    "user_id": "437426",
    "department_id": "6",
    "job_id": "9"
  },
  {
    "user_id": "431417",
    "department_id": "4",
    "job_id": "8"
  },
  {
    "user_id": "404058",
    "department_id": "6",
    "job_id": "9"
  },
  {
    "user_id": "491957",
    "department_id": "5",
    "job_id": "9"
  },
  {
    "user_id": "403436",
    "department_id": "5",
    "job_id": "8"
  },
  {
    "user_id": "451355",
    "department_id": "4",
    "job_id": "9"
  },
  {
    "user_id": "453318",
    "department_id": "6",
    "job_id": "9"
  },
  {
    "user_id": "403787",
    "department_id": "4",
    "job_id": "8"
  },
  {
    "user_id": "407376",
    "department_id": "6",
    "job_id": "9"
  },
  {
    "user_id": "492647",
    "department_id": "6",
    "job_id": "9"
  },
  {
    "user_id": "482950",
    "department_id": "6",
    "job_id": "8"
  },
  {
    "user_id": "410611",
    "department_id": "6",
    "job_id": "9"
  },
  {
    "user_id": "464649",
    "department_id": "4",
    "job_id": "9"
  },
  {
    "user_id": "424527",
    "department_id": "4",
    "job_id": "9"
  },
  {
    "user_id": "408311",
    "department_id": "4",
    "job_id": "8"
  },
  {
    "user_id": "419410",
    "department_id": "4",
    "job_id": "8"
  },
  {
    "user_id": "436952",
    "department_id": "4",
    "job_id": "9"
  },
  {
    "user_id": "421482",
    "department_id": "6",
    "job_id": "8"
  },
  {
    "user_id": "418419",
    "department_id": "6",
    "job_id": "9"
  },
  {
    "user_id": "418629",
    "department_id": "6",
    "job_id": "8"
  },
  {
    "user_id": "403829",
    "department_id": "6",
    "job_id": "9"
  },
  {
    "user_id": "468108",
    "department_id": "5",
    "job_id": "8"
  },
  {
    "user_id": "420488",
    "department_id": "4",
    "job_id": "9"
  },
  {
    "user_id": "453044",
    "department_id": "6",
    "job_id": "8"
  },
  {
    "user_id": "412578",
    "department_id": "6",
    "job_id": "8"
  },
  {
    "user_id": "428809",
    "department_id": "4",
    "job_id": "8"
  },
  {
    "user_id": "490709",
    "department_id": "6",
    "job_id": "8"
  },
  {
    "user_id": "498712",
    "department_id": "6",
    "job_id": "8"
  },
  {
    "user_id": "424177",
    "department_id": "6",
    "job_id": "8"
  },
  {
    "user_id": "483994",
    "department_id": "6",
    "job_id": "9"
  },
  {
    "user_id": "455415",
    "department_id": "4",
    "job_id": "8"
  },
  {
    "user_id": "443558",
    "department_id": "6",
    "job_id": "8"
  },
  {
    "user_id": "478049",
    "department_id": "5",
    "job_id": "8"
  },
  {
    "user_id": "474374",
    "department_id": "6",
    "job_id": "9"
  },
  {
    "user_id": "414452",
    "department_id": "4",
    "job_id": "9"
  },
  {
    "user_id": "430685",
    "department_id": "6",
    "job_id": "9"
  },
  {
    "user_id": "465209",
    "department_id": "6",
    "job_id": "9"
  },
  {
    "user_id": "434935",
    "department_id": "6",
    "job_id": "9"
  },
  {
    "user_id": "421014",
    "department_id": "6",
    "job_id": "8"
  },
  {
    "user_id": "440959",
    "department_id": "6",
    "job_id": "8"
  },
  {
    "user_id": "431865",
    "department_id": "5",
    "job_id": "8"
  },
  {
    "user_id": "483767",
    "department_id": "6",
    "job_id": "9"
  },
  {
    "user_id": "405855",
    "department_id": "6",
    "job_id": "9"
  },
  {
    "user_id": "471377",
    "department_id": "5",
    "job_id": "8"
  },
  {
    "user_id": "414031",
    "department_id": "5",
    "job_id": "8"
  },
  {
    "user_id": "491292",
    "department_id": "4",
    "job_id": "8"
  },
  {
    "user_id": "490351",
    "department_id": "5",
    "job_id": "9"
  },
  {
    "user_id": "461959",
    "department_id": "6",
    "job_id": "9"
  },
  {
    "user_id": "493432",
    "department_id": "6",
    "job_id": "8"
  },
  {
    "user_id": "457809",
    "department_id": "6",
    "job_id": "8"
  },
  {
    "user_id": "410063",
    "department_id": "4",
    "job_id": "8"
  },
  {
    "user_id": "483452",
    "department_id": "6",
    "job_id": "8"
  },
  {
    "user_id": "450537",
    "department_id": "4",
    "job_id": "8"
  },
  {
    "user_id": "428940",
    "department_id": "5",
    "job_id": "9"
  },
  {
    "user_id": "498153",
    "department_id": "6",
    "job_id": "8"
  },
  {
    "user_id": "422902",
    "department_id": "6",
    "job_id": "8"
  },
  {
    "user_id": "491519",
    "department_id": "6",
    "job_id": "8"
  },
  {
    "user_id": "472764",
    "department_id": "5",
    "job_id": "8"
  },
  {
    "user_id": "417276",
    "department_id": "4",
    "job_id": "9"
  },
  {
    "user_id": "469907",
    "department_id": "6",
    "job_id": "9"
  },
  {
    "user_id": "439963",
    "department_id": "4",
    "job_id": "9"
  },
  {
    "user_id": "425257",
    "department_id": "6",
    "job_id": "8"
  }
];

const USER_SCHEDULES = [
  {
    "department_id": "4",
    "user_id": "457042",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Australia/Sydney",
    "clock_in": "05:30",
    "clock_out": "14:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"09:30\",\"endTime\":\"09:45\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"11:00\",\"endTime\":\"12:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"13:30\",\"endTime\":\"13:45\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "5",
    "user_id": "478224",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "America/New_York",
    "clock_in": "15:30",
    "clock_out": "00:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"17:30\",\"endTime\":\"17:45\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"19:30\",\"endTime\":\"20:30\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"21:30\",\"endTime\":\"21:45\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "6",
    "user_id": "489776",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Europe/London",
    "clock_in": "21:00",
    "clock_out": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "4",
    "user_id": "432174",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Australia/Sydney",
    "clock_in": "05:30",
    "clock_out": "14:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"09:30\",\"endTime\":\"09:45\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"11:00\",\"endTime\":\"12:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"13:30\",\"endTime\":\"13:45\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "4",
    "user_id": "487742",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Australia/Sydney",
    "clock_in": "05:30",
    "clock_out": "14:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"09:30\",\"endTime\":\"09:45\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"11:00\",\"endTime\":\"12:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"13:30\",\"endTime\":\"13:45\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "6",
    "user_id": "456288",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Europe/London",
    "clock_in": "21:00",
    "clock_out": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "6",
    "user_id": "481914",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Europe/London",
    "clock_in": "21:00",
    "clock_out": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "4",
    "user_id": "491836",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Australia/Sydney",
    "clock_in": "05:30",
    "clock_out": "14:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"09:30\",\"endTime\":\"09:45\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"11:00\",\"endTime\":\"12:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"13:30\",\"endTime\":\"13:45\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "6",
    "user_id": "477513",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Europe/London",
    "clock_in": "21:00",
    "clock_out": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "6",
    "user_id": "470910",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Europe/London",
    "clock_in": "21:00",
    "clock_out": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "4",
    "user_id": "440247",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Australia/Sydney",
    "clock_in": "05:30",
    "clock_out": "14:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"09:30\",\"endTime\":\"09:45\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"11:00\",\"endTime\":\"12:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"13:30\",\"endTime\":\"13:45\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "4",
    "user_id": "416701",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Australia/Sydney",
    "clock_in": "05:30",
    "clock_out": "14:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"09:30\",\"endTime\":\"09:45\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"11:00\",\"endTime\":\"12:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"13:30\",\"endTime\":\"13:45\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "6",
    "user_id": "415516",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Europe/London",
    "clock_in": "21:00",
    "clock_out": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "4",
    "user_id": "413921",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Australia/Sydney",
    "clock_in": "05:30",
    "clock_out": "14:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"09:30\",\"endTime\":\"09:45\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"11:00\",\"endTime\":\"12:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"13:30\",\"endTime\":\"13:45\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "5",
    "user_id": "466663",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "America/New_York",
    "clock_in": "15:30",
    "clock_out": "00:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"17:30\",\"endTime\":\"17:45\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"19:30\",\"endTime\":\"20:30\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"21:30\",\"endTime\":\"21:45\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "6",
    "user_id": "467465",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Europe/London",
    "clock_in": "21:00",
    "clock_out": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "6",
    "user_id": "495207",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Europe/London",
    "clock_in": "21:00",
    "clock_out": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "5",
    "user_id": "480594",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "America/New_York",
    "clock_in": "15:30",
    "clock_out": "00:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"17:30\",\"endTime\":\"17:45\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"19:30\",\"endTime\":\"20:30\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"21:30\",\"endTime\":\"21:45\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "6",
    "user_id": "466236",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Europe/London",
    "clock_in": "21:00",
    "clock_out": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "4",
    "user_id": "429805",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Australia/Sydney",
    "clock_in": "05:30",
    "clock_out": "14:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"09:30\",\"endTime\":\"09:45\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"11:00\",\"endTime\":\"12:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"13:30\",\"endTime\":\"13:45\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "6",
    "user_id": "464458",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Europe/London",
    "clock_in": "21:00",
    "clock_out": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "6",
    "user_id": "461692",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Europe/London",
    "clock_in": "21:00",
    "clock_out": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "6",
    "user_id": "420434",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Europe/London",
    "clock_in": "21:00",
    "clock_out": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "4",
    "user_id": "414304",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Australia/Sydney",
    "clock_in": "05:30",
    "clock_out": "14:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"09:30\",\"endTime\":\"09:45\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"11:00\",\"endTime\":\"12:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"13:30\",\"endTime\":\"13:45\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "6",
    "user_id": "457252",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Europe/London",
    "clock_in": "21:00",
    "clock_out": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "4",
    "user_id": "492350",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Australia/Sydney",
    "clock_in": "05:30",
    "clock_out": "14:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"09:30\",\"endTime\":\"09:45\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"11:00\",\"endTime\":\"12:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"13:30\",\"endTime\":\"13:45\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "4",
    "user_id": "433683",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Australia/Sydney",
    "clock_in": "05:30",
    "clock_out": "14:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"09:30\",\"endTime\":\"09:45\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"11:00\",\"endTime\":\"12:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"13:30\",\"endTime\":\"13:45\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "4",
    "user_id": "459221",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Australia/Sydney",
    "clock_in": "05:30",
    "clock_out": "14:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"09:30\",\"endTime\":\"09:45\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"11:00\",\"endTime\":\"12:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"13:30\",\"endTime\":\"13:45\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "4",
    "user_id": "496680",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Australia/Sydney",
    "clock_in": "05:30",
    "clock_out": "14:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"09:30\",\"endTime\":\"09:45\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"11:00\",\"endTime\":\"12:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"13:30\",\"endTime\":\"13:45\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "6",
    "user_id": "438808",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Europe/London",
    "clock_in": "21:00",
    "clock_out": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "6",
    "user_id": "449483",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Europe/London",
    "clock_in": "21:00",
    "clock_out": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "6",
    "user_id": "478610",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Europe/London",
    "clock_in": "21:00",
    "clock_out": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "4",
    "user_id": "474376",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Australia/Sydney",
    "clock_in": "05:30",
    "clock_out": "14:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"09:30\",\"endTime\":\"09:45\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"11:00\",\"endTime\":\"12:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"13:30\",\"endTime\":\"13:45\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "4",
    "user_id": "429807",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Australia/Sydney",
    "clock_in": "05:30",
    "clock_out": "14:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"09:30\",\"endTime\":\"09:45\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"11:00\",\"endTime\":\"12:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"13:30\",\"endTime\":\"13:45\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "4",
    "user_id": "464591",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Australia/Sydney",
    "clock_in": "05:30",
    "clock_out": "14:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"09:30\",\"endTime\":\"09:45\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"11:00\",\"endTime\":\"12:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"13:30\",\"endTime\":\"13:45\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "5",
    "user_id": "442513",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "America/New_York",
    "clock_in": "15:30",
    "clock_out": "00:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"17:30\",\"endTime\":\"17:45\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"19:30\",\"endTime\":\"20:30\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"21:30\",\"endTime\":\"21:45\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "4",
    "user_id": "400746",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Australia/Sydney",
    "clock_in": "05:30",
    "clock_out": "14:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"09:30\",\"endTime\":\"09:45\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"11:00\",\"endTime\":\"12:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"13:30\",\"endTime\":\"13:45\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "6",
    "user_id": "499613",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Europe/London",
    "clock_in": "21:00",
    "clock_out": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "6",
    "user_id": "437426",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Europe/London",
    "clock_in": "21:00",
    "clock_out": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "4",
    "user_id": "431417",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Australia/Sydney",
    "clock_in": "05:30",
    "clock_out": "14:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"09:30\",\"endTime\":\"09:45\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"11:00\",\"endTime\":\"12:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"13:30\",\"endTime\":\"13:45\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "6",
    "user_id": "404058",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Europe/London",
    "clock_in": "21:00",
    "clock_out": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "5",
    "user_id": "491957",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "America/New_York",
    "clock_in": "15:30",
    "clock_out": "00:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"17:30\",\"endTime\":\"17:45\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"19:30\",\"endTime\":\"20:30\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"21:30\",\"endTime\":\"21:45\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "5",
    "user_id": "403436",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "America/New_York",
    "clock_in": "15:30",
    "clock_out": "00:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"17:30\",\"endTime\":\"17:45\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"19:30\",\"endTime\":\"20:30\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"21:30\",\"endTime\":\"21:45\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "4",
    "user_id": "451355",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Australia/Sydney",
    "clock_in": "05:30",
    "clock_out": "14:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"09:30\",\"endTime\":\"09:45\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"11:00\",\"endTime\":\"12:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"13:30\",\"endTime\":\"13:45\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "6",
    "user_id": "453318",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Europe/London",
    "clock_in": "21:00",
    "clock_out": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "4",
    "user_id": "403787",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Australia/Sydney",
    "clock_in": "05:30",
    "clock_out": "14:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"09:30\",\"endTime\":\"09:45\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"11:00\",\"endTime\":\"12:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"13:30\",\"endTime\":\"13:45\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "6",
    "user_id": "407376",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Europe/London",
    "clock_in": "21:00",
    "clock_out": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "6",
    "user_id": "492647",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Europe/London",
    "clock_in": "21:00",
    "clock_out": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "6",
    "user_id": "482950",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Europe/London",
    "clock_in": "21:00",
    "clock_out": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "6",
    "user_id": "410611",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Europe/London",
    "clock_in": "21:00",
    "clock_out": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "4",
    "user_id": "464649",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Australia/Sydney",
    "clock_in": "05:30",
    "clock_out": "14:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"09:30\",\"endTime\":\"09:45\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"11:00\",\"endTime\":\"12:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"13:30\",\"endTime\":\"13:45\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "4",
    "user_id": "424527",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Australia/Sydney",
    "clock_in": "05:30",
    "clock_out": "14:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"09:30\",\"endTime\":\"09:45\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"11:00\",\"endTime\":\"12:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"13:30\",\"endTime\":\"13:45\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "4",
    "user_id": "408311",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Australia/Sydney",
    "clock_in": "05:30",
    "clock_out": "14:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"09:30\",\"endTime\":\"09:45\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"11:00\",\"endTime\":\"12:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"13:30\",\"endTime\":\"13:45\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "4",
    "user_id": "419410",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Australia/Sydney",
    "clock_in": "05:30",
    "clock_out": "14:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"09:30\",\"endTime\":\"09:45\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"11:00\",\"endTime\":\"12:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"13:30\",\"endTime\":\"13:45\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "4",
    "user_id": "436952",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Australia/Sydney",
    "clock_in": "05:30",
    "clock_out": "14:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"09:30\",\"endTime\":\"09:45\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"11:00\",\"endTime\":\"12:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"13:30\",\"endTime\":\"13:45\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "6",
    "user_id": "421482",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Europe/London",
    "clock_in": "21:00",
    "clock_out": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "6",
    "user_id": "418419",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Europe/London",
    "clock_in": "21:00",
    "clock_out": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "6",
    "user_id": "418629",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Europe/London",
    "clock_in": "21:00",
    "clock_out": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "6",
    "user_id": "403829",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Europe/London",
    "clock_in": "21:00",
    "clock_out": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "5",
    "user_id": "468108",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "America/New_York",
    "clock_in": "15:30",
    "clock_out": "00:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"17:30\",\"endTime\":\"17:45\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"19:30\",\"endTime\":\"20:30\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"21:30\",\"endTime\":\"21:45\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "4",
    "user_id": "420488",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Australia/Sydney",
    "clock_in": "05:30",
    "clock_out": "14:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"09:30\",\"endTime\":\"09:45\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"11:00\",\"endTime\":\"12:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"13:30\",\"endTime\":\"13:45\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "6",
    "user_id": "453044",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Europe/London",
    "clock_in": "21:00",
    "clock_out": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "6",
    "user_id": "412578",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Europe/London",
    "clock_in": "21:00",
    "clock_out": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "4",
    "user_id": "428809",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Australia/Sydney",
    "clock_in": "05:30",
    "clock_out": "14:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"09:30\",\"endTime\":\"09:45\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"11:00\",\"endTime\":\"12:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"13:30\",\"endTime\":\"13:45\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "6",
    "user_id": "490709",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Europe/London",
    "clock_in": "21:00",
    "clock_out": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "6",
    "user_id": "498712",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Europe/London",
    "clock_in": "21:00",
    "clock_out": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "6",
    "user_id": "424177",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Europe/London",
    "clock_in": "21:00",
    "clock_out": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "6",
    "user_id": "483994",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Europe/London",
    "clock_in": "21:00",
    "clock_out": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "4",
    "user_id": "455415",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Australia/Sydney",
    "clock_in": "05:30",
    "clock_out": "14:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"09:30\",\"endTime\":\"09:45\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"11:00\",\"endTime\":\"12:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"13:30\",\"endTime\":\"13:45\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "6",
    "user_id": "443558",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Europe/London",
    "clock_in": "21:00",
    "clock_out": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "5",
    "user_id": "478049",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "America/New_York",
    "clock_in": "15:30",
    "clock_out": "00:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"17:30\",\"endTime\":\"17:45\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"19:30\",\"endTime\":\"20:30\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"21:30\",\"endTime\":\"21:45\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "6",
    "user_id": "474374",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Europe/London",
    "clock_in": "21:00",
    "clock_out": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "4",
    "user_id": "414452",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Australia/Sydney",
    "clock_in": "05:30",
    "clock_out": "14:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"09:30\",\"endTime\":\"09:45\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"11:00\",\"endTime\":\"12:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"13:30\",\"endTime\":\"13:45\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "6",
    "user_id": "430685",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Europe/London",
    "clock_in": "21:00",
    "clock_out": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "6",
    "user_id": "465209",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Europe/London",
    "clock_in": "21:00",
    "clock_out": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "6",
    "user_id": "434935",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Europe/London",
    "clock_in": "21:00",
    "clock_out": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "6",
    "user_id": "421014",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Europe/London",
    "clock_in": "21:00",
    "clock_out": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "6",
    "user_id": "440959",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Europe/London",
    "clock_in": "21:00",
    "clock_out": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "5",
    "user_id": "431865",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "America/New_York",
    "clock_in": "15:30",
    "clock_out": "00:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"17:30\",\"endTime\":\"17:45\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"19:30\",\"endTime\":\"20:30\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"21:30\",\"endTime\":\"21:45\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "6",
    "user_id": "483767",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Europe/London",
    "clock_in": "21:00",
    "clock_out": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "6",
    "user_id": "405855",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Europe/London",
    "clock_in": "21:00",
    "clock_out": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "5",
    "user_id": "471377",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "America/New_York",
    "clock_in": "15:30",
    "clock_out": "00:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"17:30\",\"endTime\":\"17:45\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"19:30\",\"endTime\":\"20:30\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"21:30\",\"endTime\":\"21:45\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "5",
    "user_id": "414031",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "America/New_York",
    "clock_in": "15:30",
    "clock_out": "00:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"17:30\",\"endTime\":\"17:45\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"19:30\",\"endTime\":\"20:30\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"21:30\",\"endTime\":\"21:45\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "4",
    "user_id": "491292",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Australia/Sydney",
    "clock_in": "05:30",
    "clock_out": "14:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"09:30\",\"endTime\":\"09:45\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"11:00\",\"endTime\":\"12:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"13:30\",\"endTime\":\"13:45\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "5",
    "user_id": "490351",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "America/New_York",
    "clock_in": "15:30",
    "clock_out": "00:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"17:30\",\"endTime\":\"17:45\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"19:30\",\"endTime\":\"20:30\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"21:30\",\"endTime\":\"21:45\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "6",
    "user_id": "461959",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Europe/London",
    "clock_in": "21:00",
    "clock_out": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "6",
    "user_id": "493432",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Europe/London",
    "clock_in": "21:00",
    "clock_out": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "6",
    "user_id": "457809",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Europe/London",
    "clock_in": "21:00",
    "clock_out": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "4",
    "user_id": "410063",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Australia/Sydney",
    "clock_in": "05:30",
    "clock_out": "14:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"09:30\",\"endTime\":\"09:45\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"11:00\",\"endTime\":\"12:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"13:30\",\"endTime\":\"13:45\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "6",
    "user_id": "483452",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Europe/London",
    "clock_in": "21:00",
    "clock_out": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "4",
    "user_id": "450537",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Australia/Sydney",
    "clock_in": "05:30",
    "clock_out": "14:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"09:30\",\"endTime\":\"09:45\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"11:00\",\"endTime\":\"12:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"13:30\",\"endTime\":\"13:45\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "5",
    "user_id": "428940",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "America/New_York",
    "clock_in": "15:30",
    "clock_out": "00:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"17:30\",\"endTime\":\"17:45\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"19:30\",\"endTime\":\"20:30\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"21:30\",\"endTime\":\"21:45\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "6",
    "user_id": "498153",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Europe/London",
    "clock_in": "21:00",
    "clock_out": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "6",
    "user_id": "422902",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Europe/London",
    "clock_in": "21:00",
    "clock_out": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "6",
    "user_id": "491519",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Europe/London",
    "clock_in": "21:00",
    "clock_out": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "5",
    "user_id": "472764",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "America/New_York",
    "clock_in": "15:30",
    "clock_out": "00:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"17:30\",\"endTime\":\"17:45\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"19:30\",\"endTime\":\"20:30\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"21:30\",\"endTime\":\"21:45\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "4",
    "user_id": "417276",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Australia/Sydney",
    "clock_in": "05:30",
    "clock_out": "14:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"09:30\",\"endTime\":\"09:45\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"11:00\",\"endTime\":\"12:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"13:30\",\"endTime\":\"13:45\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "6",
    "user_id": "469907",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Europe/London",
    "clock_in": "21:00",
    "clock_out": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "4",
    "user_id": "439963",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Australia/Sydney",
    "clock_in": "05:30",
    "clock_out": "14:30",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"09:30\",\"endTime\":\"09:45\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"11:00\",\"endTime\":\"12:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"13:30\",\"endTime\":\"13:45\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  },
  {
    "department_id": "6",
    "user_id": "425257",
    "start_date": "2025-10-09",
    "user_timezone": "Asia/Manila",
    "client_timezone": "Europe/London",
    "clock_in": "21:00",
    "clock_out": "06:00",
    "description": "Default Schedule",
    "events": "[{\"timeEvent\":\"break\",\"startTime\":\"23:00\",\"endTime\":\"23:15\",\"duration_min\":\"15\",\"description\":\"First Break\"},{\"timeEvent\":\"lunch\",\"startTime\":\"01:00\",\"endTime\":\"02:00\",\"duration_min\":\"60\",\"description\":\"Lunch Break\"},{\"timeEvent\":\"break\",\"startTime\":\"03:00\",\"endTime\":\"03:15\",\"duration_min\":\"15\",\"description\":\"Second Break\"}]"
  }
];

export async function setDummyData(fetch: SvelteFetch) {
  const { data, error } = await hashPassword(fetch, PASSWORD);

  if(error){

  }
  const validUsers = createInsertSchema(tblUsers).safeParse(USERS.map(user => Object.assign(user, {password_hash: data})));
  const validDesignation = createInsertSchema(tblUserDesignation).safeParse(USER_DESIGNATIONS);
  const validSchedule = createInsertSchema(tblUserSchedule).safeParse(USER_SCHEDULES);

  if (validUsers.success && validDesignation.success && validSchedule.success) {
    await db.transaction(async (tx) => {
      await tx.insert(tblUsers).values(validUsers.data);
      await tx.insert(tblUserDesignation).values(validDesignation.data);
      await tx.insert(tblUserSchedule).values(validSchedule.data)
    })
  } else {
    console.error('Validation failed:', {
      users: validUsers.error,
      designation: validDesignation.error,
      schedule: validSchedule.error
    });
  }
}