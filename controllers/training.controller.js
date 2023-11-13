const fs = require("fs");

const path = "db/trainings.json";

const getTrainings = (req, res) => {
  try {
    const data = readFile();
    let trainings = [];

    if (data.length === 0) {
      return res.status(404).json({
        ok: false,
        message: "There are no trainings registered yet",
      });
    }

    trainings = JSON.parse(data);

    res.json({
      ok: true,
      trainings,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      message: "Something went wrong",
    });
  }
};

const getTrainers = (req, res) => {
  console.log(req.params);
  try {
    const { studentEmail } = req.params;
    const data = readFile();
    let trainings = [];

    if (data.length === 0) {
      return res.status(404).json({
        ok: false,
        message: "There are no trainings registered yet",
      });
    }

    trainings = JSON.parse(data);

    const studentTrainings = trainings.filter((training) => {
      return training.studentEmails.includes(studentEmail);
    });

    if (studentTrainings.length === 0) {
      return res.status(200).json({ ok: false, trainers: [] });
    }

    const trainersEmails = studentTrainings.map((training) => {
      return training.trainerEmail;
    });

    if (trainersEmails.length === 0) {
      return res
        .status(404)
        .json({ ok: false, message: "Cannot find trainer's email." });
    }

    const usersData = readUsersFile();
    let users = [];

    if (usersData.length === 0) {
      return res
        .status(404)
        .json({ ok: false, message: "No users in database." });
    }

    users = JSON.parse(usersData);

    const trainers = users.filter((user) => {
      return trainersEmails.includes(user.email);
    });

    if (trainers.length === 0) {
      return res.status(404).json({ ok: false, message: "No trainers found." });
    }

    res.json({
      ok: true,
      trainers,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      message: "Something went wrong",
    });
  }
};

const getTrainingByName = (req, res) => {
  try {
    const { name } = req.params;
    const data = readFile();

    let trainings = [];

    if (data.length === 0) {
      return res.status(404).json({
        ok: false,
        message: "There are no trainings registered yet",
      });
    }

    trainings = JSON.parse(data);

    const training = trainings.find((training) => training.name === name);

    if (!training) {
      return res.status(404).json({
        ok: false,
        message: `The training with the name ${name} was not found`,
      });
    }

    res.json({
      ok: true,
      training,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      message: "Something went wrong",
    });
  }
};

const addTraining = (req, res) => {
  try {
    const {
      id,
      studentEmails,
      data: trainingData,
      duration,
      name,
      description,
      type,
      trainerEmail,
    } = req.body;
    const data = readFile();
    let trainings = [];

    if (data.length > 0) {
      trainings = JSON.parse(data);
    }

    const newTraining = {
      id,
      studentEmails,
      trainingData,
      duration,
      name,
      description,
      type,
      trainerEmail,
    };

    trainings.push(newTraining);

    fs.writeFileSync(path, JSON.stringify(trainings), { flag: "w" });

    res.json({
      ok: true,
      traning: newTraining,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      message: "Something went wrong",
    });
  }
};

const deleteTraining = (req, res) => {
  try {
    const { id } = req.params;
    const data = readFile();
    let trainings = [];

    if (data.length === 0) {
      return res
        .status(404)
        .json({ ok: false, message: "Traning does not exist." });
    }

    trainings = JSON.parse(data);

    const training = trainings.find((training) => training.id === id);

    if (!training) {
      return res
        .status(404)
        .json({ ok: false, message: "The training does not exist" });
    }

    const newTraining = trainings.filter((training) => training.id !== id);

    fs.writeFileSync(path, JSON.stringify(newTraining), { flag: "w" });

    res.json({
      ok: true,
      message: `The trainer with the email ${id} was deleted`,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      message: "Something went wrong",
    });
  }
};

const readFile = () => {
  try {
    const data = fs.readFileSync(path);

    return data;
  } catch (error) {
    throw error;
  }
};

const readUsersFile = () => {
  try {
    const data = fs.readFileSync("db/users.json");

    return data;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getTrainings,
  getTrainers,
  getTrainingByName,
  addTraining,
  deleteTraining,
};
