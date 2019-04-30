const express = require("express");
const router = new express.Router();
const Task = require("../models/Task");
const auth = require("../middleware/auth");

router.post("/tasks", auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    });
    try {
        await task.save();
        res.status(201).send(task);
    } catch (err) {
        res.status(400).send();
    }
});

router.get("/tasks", auth, async (req, res) => {
    const match = {};
    const sort = {};

    if (req.query.sortBy) {
        const [sortBy, option] = req.query.sortBy.split(":");
        sort[sortBy] = option === "desc" ? 1 : -1;
    }

    if (req.query.completed) {
        match.completed = req.query.completed === "true";
    }
    try {
        await req.user
            .populate({
                path: "tasks",
                match,
                options: {
                    limit: +req.query.limit || 10,
                    skip: +req.query.skip,
                    sort
                }
            })
            .execPopulate();
        res.status(202).send(req.user.tasks);
    } catch (err) {
        res.status(500).send();
    }
});

router.get("/tasks/:id", auth, async (req, res) => {
    const _id = req.params.id;
    try {
        const task = await Task.findOne({ _id, owner: req.user._id });
        if (!task) {
            return res.status(404).send();
        }
        res.status(202).send(task);
    } catch (e) {
        res.status(500).send();
    }
});

router.patch("/tasks/:id", auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdate = ["description", "completed"];
    const isValidOperation = updates.every(update =>
        allowedUpdate.includes(update)
    );

    if (!isValidOperation) res.status(400).send({ error: "Invalid update" });

    try {
        const task = await Task.findOne({
            _id: req.params.id,
            owner: req.user._id
        });

        if (!task) {
            return res.status(404).send();
        }

        updates.forEach(update => (task[update] = req.body[update]));
        await task.save();
        res.send(task);
    } catch (e) {
        res.status(400).send(e);
    }
});

router.delete("/tasks/:id", auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            owner: req.user._id
        });
        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch (e) {
        res.status(500).send();
    }
});

module.exports = router;
