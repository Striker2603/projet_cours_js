const express = require("express")
const app = express()


const mysql = require("mysql2")
const myconnection = require("express-myconnection")

const configBdd = {
    host: "localhost",
    user: "root",
    password: "",
    database: "artist",
    port: 3306
}

app.use(myconnection(mysql, configBdd, "pool"))

app.set("view engine", "ejs")
app.set("views", "frontend")

app.use(express.urlencoded({ extended: false }))


app.get("/", (requette, reponse) => {
    let id_edition = requette.query.edit || null; 

    requette.getConnection((erreur, connection) => {
        if (erreur) {
            console.log(erreur)
            return reponse.status(500).send("Erreur de connexion")
        }
        connection.query("SELECT * FROM t_artiste", [], (erreur, resultat) => {
            if (erreur) {
                console.log(erreur)
            } else {
                
                reponse.render("index", { resultat, id_mode_edition: id_edition })
            }
        }) 
    })
})

// 2. AJOUT (CREATE)
app.post("/save", (requette, reponse) => {
    let { prenom, age, nationalite } = requette.body

    requette.getConnection((erreur, connection) => {
        if (erreur) return console.log(erreur)
        connection.query(
            "INSERT INTO t_artiste(prenom, age, nationalite) VALUES (?, ?, ?)", 
            [prenom, age, nationalite], 
            (erreur) => {
                if (erreur) return console.log(erreur)
                reponse.redirect("/")
            }
        )
    })
})


app.post("/update", (requette, reponse) => {
    let id = requette.query.id
    let { prenom, age, nationalite } = requette.body

    if (!id) return reponse.redirect("/")

    requette.getConnection((erreur, connection) => {
        if (erreur) return console.log(erreur)
        connection.query(
            "UPDATE t_artiste SET prenom = ?, age = ?, nationalite = ? WHERE id = ?", 
            [prenom, age, nationalite, id], 
            (erreur) => {
                if (erreur) return console.log(erreur)
                console.log(`Artiste ${id} mis à jour`)
                reponse.redirect("/")
            }
        )
    })
})


app.get("/supprimer", (requette, reponse) => {
    let id = requette.query.id
    if (!id) return reponse.redirect("/")

    requette.getConnection((erreur, connection) => {
        if (erreur) return console.log(erreur)
        connection.query("DELETE FROM t_artiste WHERE id = ?", [id], (erreur) => {
            if (erreur) return console.log(erreur)
            reponse.redirect("/")
        })
    })
})


app.listen(3001, () => {
    console.log("Serveur démarré sur http://localhost:3001")
})