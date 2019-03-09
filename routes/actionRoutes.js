const express = require('express');
const router = express.Router();
const db = require('../data/helpers/actionModel');
const projectsDb = require('../data/helpers/projectModel'); // Needed to check foreign key on actions.

router.get('/', (req, res) => {
  db.get()
    .then(actions => res.json({ actions }))
    .catch(error => res.status(500).json({ error }));
});

router.post('/', (req, res) => {
  const { project_id, description, notes, completed } = req.body;
  const entry = { project_id, description, notes, completed };
  if (!project_id || !description || !notes)
    return res.status(400).json({
      error:
        'Request body must include project_id, description, and notes keys.',
    });
  projectsDb
    .get(project_id)
    .then(() => db.insert(entry))
    .then(action => res.status(201).json({ action }))
    .catch(error => {
      if (error.message === "Cannot set property 'actions' of undefined")
        return res.status(404).json({
          error: 'project_id key must refer to the id of an existing project.',
        });
      else res.status(500).json({ error });
    });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.get(id)
    .then(action => res.json({ action }))
    .catch(error => {
      if (error.message === "Cannot read property 'completed' of undefined")
        return res.status(404).json({
          error: 'No action with that ID found.',
        });
      else res.status(500).json({ error });
    });
});

router.put('/:id', (req, res) => {
  const { project_id, description, notes, completed } = req.body;
  const { id } = req.params;
  const entry = { project_id, description, notes, completed };
  if (!project_id || !description || !notes)
    return res.status(400).json({
      error:
        'Request body must include project_id, description, and notes keys.',
    });
  projectsDb
    .get(project_id)
    .then(() => db.update(id, entry))
    .then(action => {
      if (action === null)
        return res.status(404).json({ error: 'No action with that ID found.' });
      else return res.json({ action });
    })
    .catch(error => {
      if (error.message === "Cannot set property 'actions' of undefined")
        return res.status(404).json({
          error: 'project_id key must refer to the id of an existing project.',
        });
      else res.status(500).json({ error });
    });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.remove(id)
    .then(count => {
      if (count) return res.json({ success: 'Action successfully deleted.' });
      else
        return res.status(404).json({ error: 'No action with that ID found.' });
    })
    .catch(error => res.status(500).json({ error }));
});

module.exports = router;
