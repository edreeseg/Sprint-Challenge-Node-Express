const express = require('express');
const router = express.Router();
const db = require('../data/helpers/projectModel');

router.get('/', (req, res) => {
  db.get()
    .then(projects => res.json({ projects }))
    .catch(error => res.status(500).json({ error }));
});

router.post('/', (req, res) => {
  const { name, description, completed } = req.body;
  const entry = { name, description, completed };
  if (!name || !description)
    return res.status(400).json({
      error: 'Request must include name and description keys.',
    });
  db.insert(entry)
    .then(project => res.status(201).json({ project }))
    .catch(error => res.status(500).json({ error }));
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.get(id)
    .then(project => res.json({ project }))
    .catch(error => {
      if (error.message === "Cannot set property 'actions' of undefined")
        return res
          .status(404)
          .json({ error: 'No project with that ID found.' });
      else res.status(500).json({ error });
    });
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, description, completed } = req.body;
  const entry = { name, description, completed };
  if (!name || !description)
    return res.status(400).json({
      error: 'Request must include name and description keys.',
    });
  db.update(id, entry)
    .then(project => {
      if (project === null)
        return res
          .status(404)
          .json({ error: 'No project with that ID found.' });
      else return res.json({ project });
    })
    .catch(error => res.status(500).json({ error }));
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.remove(id)
    .then(count => {
      if (count) return res.json({ success: 'Project successfully deleted.' });
      else
        return res
          .status(404)
          .json({ error: 'No project with that ID found.' });
    })
    .catch(error => res.status(500).json({ error }));
});

router.get('/:id/actions', (req, res) => {
  const { id } = req.params;
  db.get(id) // Must make a call to the get method first, because getProjectActions does not notify of nonexistent resource.
    .then(() => db.getProjectActions(id))
    .then(actions => res.json({ actions }))
    .catch(error => {
      if (error.message === "Cannot set property 'actions' of undefined")
        return res
          .status(404)
          .json({ error: 'No project with that ID found.' });
      else res.status(500).json({ error });
    });
});

module.exports = router;
