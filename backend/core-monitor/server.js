import { urls, collections, statusHistory } from "./general-dal";

const express = require("express");
const https = require('https');
const fs = require('fs')
const app = express();

function monitor(){
    statusHistory.getAll
}