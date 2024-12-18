const getCharacters = require('./getCharacter');

module.exports = function (app, passport, db) {
  // normal routes ===============================================================

  // show the home page (will also have our login links)
  app.get('/', function (req, res) {
    res.render('index.ejs');
  });

  // PROFILE SECTION =========================
  app.get('/profile', isLoggedIn, async function (req, res) {
    const characters = await getCharacters(0);
    res.render('profile.ejs', {
      user: req.user,
      characters: characters.data,
    });
  });

  //unused post cause didnt work
  app.post('/update', isLoggedIn, async function (req, res) {
    const rand = req.body.randCount;
    console.log({ rand });
    const characters = await getCharacters(rand);
    console.log(characters); 
    res.render('profile.ejs', {
      user: req.user,
      characters: characters.data,
    });
  });


  // LOGOUT ==============================
  app.get('/logout', function (req, res) {
    req.logout(() => {
      console.error('User has logged out!');
    });
    res.redirect('/');
  });

  // favorite routes ===============================================================
  app.post('/favorites', async (req, res) => {
    try {
      const name = req.body.name.trim();
      const exists = req.user.favorites.some((fav) => fav.name === name);
      if (!exists) {
        req.user.favorites.push({ name });
        await req.user.save();
        res.redirect('/profile');
      } else {
        res.status(400).send('Character already in favorites');
      }
    } catch (error) {
      console.error('Error posting character', error);
      res.status(500).send('Error posting character');
    }
  });

  app.delete('/favorites', async (req, res) => {
    try {
      req.user.favorites = req.user.favorites.filter(
        (obj) => obj.name != req.body.name.trim()
      );
      await req.user.save();
      res.redirect('/profile');
    } catch (error) {
      console.error('Error deleting character', error);
      res.status(500).send('Error deleting character');
    }
  });

  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================
  // show the login form
  app.get('/login', function (req, res) {
    res.render('login.ejs', { message: req.flash('loginMessage') });
  });

  // process the login form
  app.post(
    '/login',
    passport.authenticate('local-login', {
      successRedirect: '/profile', // redirect to the secure profile section
      failureRedirect: '/login', // redirect back to the signup page if there is an error
      failureFlash: true, // allow flash messages
    })
  );

  // SIGNUP =================================
  // show the signup form
  app.get('/signup', function (req, res) {
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

  // process the signup form
  app.post(
    '/signup',
    passport.authenticate('local-signup', {
      successRedirect: '/profile', // redirect to the secure profile section
      failureRedirect: '/signup', // redirect back to the signup page if there is an error
      failureFlash: true, // allow flash messages
    })
  );

  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  app.get('/unlink/local', isLoggedIn, function (req, res) {
    var user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function (err) {
      res.redirect('/profile');
    });
  });
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
}
