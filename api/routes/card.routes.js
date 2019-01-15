var _ = require('lodash');
var Card = require('../models/card.js');
var log = require('../../dev-logger.js');

module.exports = function(app) {
    log('starting card routes');
    /* Create */
    app.post('/card', function (req, res) {
        log('POST /card');
        var newCard = new Card(req.body);
        newCard.save(function(err, newCard) {
            if (err) {
                res.json({info: 'error during card create', error: err});
            };
            // res.json({info: 'card created successfully', data: newCard});
            res.json(newCard);
        });
    });

    /* Read */
    app.get('/card', function (req, res) {
        log('GET /card');
        Card.find(function(err, cards) {
            if (err) {
                res.json({info: 'error during find cards', error: err});
            };
            // res.json({info: 'cards found successfully', data: cards});
            res.json(cards);
        });
    });

    app.get('/card/:id', function (req, res) {
        log('GET /card/:id');
        Card.findById(req.params.id, function(err, card) {
            if (err) {
                res.json({info: 'error during find card', error: err});
            };
            if (card) {
                // res.json({info: 'card found successfully', data: card});
                res.json(card);
            } else {
                res.json({info: 'card not found'});
            }
        });
    });

    /* Update */
    app.put('/card/:id', function (req, res) {
        log('PUT /card/:id');
        Card.findById(req.params.id, function(err, card) {
            if (err) {
                res.json({info: 'error during find card', error: err});
            };
            if (card) {
                _.merge(card, req.body);
                card.save(function(err) {
                    if (err) {
                        res.json({info: 'error during card update', error: err});
                    };
                    res.json({info: 'card updated successfully'});
                });
            } else {
                res.json({info: 'card not found'});
            }

        });
    });

    app.put('/cardAll', function (req, res) {
      log('PUT /cardAll');
      console.log(req.body);
      Card.find({boardId: req.body.boardId}, function(error, cards) {
        if (error) {
          res.status(404).json({info: 'Unable to find cards', error});
        }
        if (cards) {
          log(req.body.cards);
          res.status(200).json(_.merge(cards, req.body.cards));
        } else {
          res.status(404).json({info: 'Cards not found'});
        }
      });
    })

    /* Delete */
    app.delete('/card/:id', function (req, res) {
        log('DELETE /card/:id');
        Card.findByIdAndRemove(req.params.id, function(err, ) {
            if (err) {
                res.json({info: 'error during remove card', error: err});
            };
            res.status(200).json(req.body.card);
        });
    });
};
