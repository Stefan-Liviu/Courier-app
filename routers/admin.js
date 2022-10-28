const express = require('express');
const router = express.Router();
const path = require('path');
const controller = require(path.resolve('./database/controller'));

router.get('/admin/members', (req, res) => {
    controller.members(req, res);
});

router.get('/admin/user/(:id)/edit', (req, res) => {
    controller.editUser(req, res);

});

router.post('/admin/user/(:id)/update', (req, res) => {
    controller.updateUser(req, res)
})

router.get('/admin/user/(:id)/delete', (req, res) => {
    controller.deleteUser(req, res);
})
module.exports = router;