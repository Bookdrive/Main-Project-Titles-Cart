const express = require("express");
const db = require('../Database/database');
const multer = require('multer');
const router = express.Router();
const passport = require('passport');
const path = require('path');
const nodemailer = require("nodemailer");

const isLoggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.redirect('/login');
    }
}

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Successful authentication, redirect home.
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/explore' }),
    (req, res) => res.redirect('/explore')
);

router.get('/logout', (req, res) => {
    req.session = null;
    req.logout();
    res.redirect('/');
});

router.get("/", (req, res) => res.render("home", { user: req.user }));

router.get('/about', (req, res) => res.render('about', { user: req.user }))

router.get('/contact', (req, res) => res.render('contact', { user: req.user }))

router.post('/contact', (req, res) => {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'example@gmail.com',
            pass: 'password'
        }
    })

    const mailOptions = {
        from: `${req.body.email}`,
        to: 'haidermohd9250@gmail.com',
        subject: `Query Regarding Website`,
        text: `Name: ${req.body.fname} ${req.body.lname} \nPhone: ${req.body.phone} \nEmail: ${req.body.email} \nMessage: ${req.body.message}`
    }

    transporter.sendMail(mailOptions, (error, infor) => {
        if (error) {
            console.log(error);
            res.send('error');
        }
        else {
            console.log('Email Sent: ' + infor.response);
            res.send('success')
        }
    });
});

router.get('/register', (req, res) => res.render('register', { user: req.user }));

router.get('/explore', async (req, res) => {
    const query =
        "select users.Googleid,users.Name,posts.id,posts.images,posts.city,posts.area, books.title,books.description,books.price,categories.subject,posts.postdate from posts join categories on posts.id=categories.postid join books on posts.id=books.postid join users on users.Googleid=posts.userid";
    const [rows] = await db.query(query);
    // console.log(rows);
    res.render('explore', {
        rows,
        user: req.user,
        searchItem:"",
        searchLocation:"",
    });
});

router.post('/explore', async (req, res) => {
    let searchItem = req.body.searchItem;
    let searchLocation = req.body.searchLocation;
    // console.log("search location", searchLocation);
    // console.log("search item", searchItem);
   

   const query = `select users.Googleid,users.Name,posts.id,posts.images, 
    books.title,books.description,books.price,categories.subject,posts.postdate 
    from posts join categories on posts.id=categories.postid join 
    books on posts.id=books.postid join users on users.Googleid=posts.userid 
    WHERE (posts.city LIKE '%${searchLocation}%' OR posts.area LIKE '%${searchLocation}%') AND (books.title LIKE '%${searchItem}%' OR books.description LIKE '${searchItem}')`;

    
        const [rows] = await db.query(query);
        
        res.render('explore', {
            rows: rows,
            user: req.user,
            searchLocation,
            searchItem,
        });
        
 
});

router.post('/explore/filter',async(req,res)=>{
    let searchItem = req.body.searchItem;
    let searchLocation = req.body.searchLocation;
    let graduate =req.body.graduate
    let type=req.body.type;
    // console.log("search location", searchLocation);
    // console.log("search item", searchItem);
    
   

   let query = `select users.Googleid,users.Name,posts.id,posts.images, 
    books.title,books.description,books.price,categories.subject,posts.postdate 
    from posts join categories on posts.id=categories.postid join 
    books on posts.id=books.postid join users on users.Googleid=posts.userid 
    WHERE (posts.city LIKE '%${searchLocation}%' OR posts.area LIKE '%${searchLocation}%') AND (books.title LIKE '%${searchItem}%' OR books.description LIKE '${searchItem}')`;

    // console.log(graduate.join(","))
    
if(graduate.length>0){
    graduate= await graduate.join(",");
    query=query+` AND categories.graduate IN(${graduate})`
    // console.log(query)
}

if(type.length>0){
    type= await type.join(",");
    query=query+` AND books.type IN(${type})`
    // console.log(query)
}
        const [rows] = await db.query(query);
        
        res.send({rows})

})
// for cinName
router.get('/explore/cityName',async(req,res)=>{
const query=`select posts.city from posts ORDER BY postdate DESC LIMIT 5`;
const [rows] = await db.query(query);
res.send({rows});
})
router.get("/login", (req, res) => res.render("login", { user: req.user }));

router.post("/login", (req, res) => res.redirect("home"));

router.get('/post', isLoggedIn, (req, res) => res.render('post', { user: req.user }));

router.get('/explore/:id', async (req, res) => {
    let id = req.params.id;
    const query1 = "select users.Googleid,users.Name,posts.id,posts.images,posts.phone ,posts.city,posts.area,books.description, books.title,books.price,categories.subject,posts.postdate from posts join categories on posts.id=categories.postid join books on posts.id=books.postid join users on users.Googleid=posts.userid where posts.id=?";

    const query2 = "SELECT image FROM test.images where postid=?";

    const [rows] = await db.query(query1, [id]);
    const [row] = await db.query(query2, [id]);
    // console.log(rows);
    // console.log(row);
    const query3 = "select users.Googleid,users.Name,posts.id,posts.images,posts.city,posts.area, books.title,books.description,books.price,categories.subject,posts.postdate from posts join categories on posts.id=categories.postid join books on posts.id=books.postid join users on users.Googleid=posts.userid where categories.subject=?";

    const [sliderData] = await db.query(query3, [rows[0].subject]);
    // console.log(sliderData);
    res.render('item-details', { rows, row, slider: sliderData, user: req.user });
});

router.get('/user/:id', async (req, res) => {
    let id = req.params.id;

    const query1 = "select * from users where Googleid=?";
    const query2 = "select posts.id,posts.images,posts.postdate,books.price,books.description from posts join books on posts.id=books.postid  where posts.userid=?";

    const [row] = await db.query(query1, [id]);
    const [rows] = await db.query(query2, [id]);
    // console.log(rows);
    // console.log(row);
    res.render('seller', { rows: rows, row: row, user: req.user })
})

// ---------------User profile DASHBOARD------------
router.get('/profile/:id', async (req, res) => {
    let id = req.params.id;
    const query1 = "select * from users where Googleid=?";
    const query2 = "select posts.id,posts.images,posts.postdate,books.price,books.description from posts join books on posts.id=books.postid  where posts.userid=?";

    const [row] = await db.query(query1, [id]);
    const [rows] = await db.query(query2, [id]);
    // console.log(rows);
    // console.log(row);
    let sessionMessage = req.session.sessionMessage;
    if (!sessionMessage) {
        sessionMessage = {
            isFinish: false
        }
    }
    req.session.sessionMessage = null;

    res.render('profile', { sessionMessage, rows: rows, row: row, user: req.user })
});

//----------for file upload----------

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/post-images')
    },
    filename: (req, file, cb) => {

        cb(null, Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({ storage: storage })



router.post("/post", upload.array("images", 3), async (req, res) => {
    // console.log(req.files);
    let data = req.body;
    console.log(data);
    let d = new Date();
    let NoTimeDate = d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate();

    const [rows] = await db.query("INSERT INTO posts (images, userid,phone,city,area ,postdate) VALUES (?,?,?,?,?,?)", [req.files[0].filename, req.user.id, data.phone, data.city,data.area, NoTimeDate]);
    let post_id = rows.insertId;
    await db.query("INSERT INTO books (type,price,page,description,title,postid) VALUES (?,?,?,?,?,?)", [data.type, data.price, data.page, data.description, data.title, post_id]);
    await db.query("INSERT INTO categories (graduate,subject,postid) VALUES (?,?,?)", [data.graduate, data.subject, post_id]);

    for (let i = 1; i < req.files.length; i++) {
        await db.query("INSERT INTO images (image,postid) VALUE (?,?)", [req.files[i].filename, post_id]);
    }

    let query = 'select userid from posts where id=(?)';
    const [userId] = await db.query(query, [post_id]);
    req.session.sessionMessage = {
        isFinish: true,
        message: "Post created successfully!"
    }
    console.log(userId);
    res.redirect(`/profile/${userId[0].userid}`);
});

// deleting the post 

router.get('/delete/:id', async (req, res) => {
    let id = req.params.id;
    await db.query("DELETE FROM books WHERE postid=?", [id]);
    await db.query("DELETE FROM categories WHERE postid=?", [id]);
    await db.query("DELETE FROM images WHERE postid=?", [id]);
    await db.query("DELETE FROM posts WHERE id=?", [id]);

    req.session.sessionMessage = {
        isFinish: true,
        message: "Post delete successfully!"
    }
    res.redirect('back');
});

// update THE POST

router.get('/update/:id', async (req, res) => {
    let id = req.params.id;
    const query = "select users.Googleid,users.Name,posts.id,posts.phone,posts.city,posts.area,books.description, books.type,books.title,books.page,books.price,categories.graduate,categories.subject,posts.postdate from posts join categories on posts.id=categories.postid join books on posts.id=books.postid join users on users.Googleid=posts.userid where posts.id=?";

    const [rows] = await db.query(query, [id]);

    res.render("update", { rows: rows[0], user: req.user });
});


router.post('/update/:id', async (req, res) => {
    let id = req.params.id;

    const { price, page, type, subject, graduate, phone, city,area, description, title } = req.body;

    let books = `UPDATE books SET price = '${price}',type='${type}' ,page = '${page}', description='${description}' ,title='${title}' WHERE postid = ${id}`;

    let categories = `UPDATE categories SET graduate='${graduate}',subject='${subject}' WHERE postid = ${id}`;

    let posts = `UPDATE posts SET phone='${phone}',city='${city}',area='${area}' WHERE id = ${id}`;

    let query = 'select userid from posts where id=(?)';

    const [userId] = await db.query(query, [id]);

    console.log(userId);

    await db.query(books);
    await db.query(categories);
    await db.query(posts);
    console.log("body data=>", req.body, userId);
    req.session.sessionMessage = {
        isFinish: true,
        message: "Post updated successfully!"
    }
    res.redirect(`/profile/${userId[0].userid}`);
});

module.exports = router;