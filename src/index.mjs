import express, { request, response } from 'express';
import { createApp } from './createApp.mjs';
import mongoose, { mongo } from 'mongoose';
// import './strategies/discord-strategies.mjs';

mongoose
    .connect('mongodb://localhost/express_tutorial')
    .then(() => console.log('connected to database'))
    .catch((err) => console.log(`Error:${err}`));

const app = createApp();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Running on Port ${PORT}`));

// app id - 1286362979784200192
// public key - fb9bdfa4859499ae701c11b40fc1bf02885809a935484e94591a4607d6c5b007
// redirect url - http://localhost:3000/api/auth/discord/redirect
