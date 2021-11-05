// ! use Better Comment on VSCODE.
const validator = require("validator");
const mysql = require("mysql");
const uniqid = require('uniqid'); // pour generer un uniqID.

exports.addEmployee = async (req, res) => {
    // todo - [X] validation des params recu.
    // todo - [X] generer un uniq id.( en String )
    // todo - [X] ajouter un employee a la BDD.
    // destructuring 
    const {
        name,
        firstName,
        department
    } = req.body;

    // validation des données avec VALIDATOR  
    // @link https://www.npmjs.com/package/validator
    if(!name ||!firstName || !department) {
        return res.json({
            success: false,
            msg : "Les champs doivent être remplies"
        });
    }

    if(!validator.isLength(name, {min : 3})) {
        return res.json({
            success : false,
            msg : "Veuillez saisir un nom valide ( 3 caractere minimum )"
        });
    }

    if(!validator.isLength(firstName, {min : 3})) {
        return res.json({
            success : false,
            msg : "Veuillez saisir un prénom valide ( 3 caractere minimum )"
        });
    }

    if(!validator.isLength(firstName, {min : 3})) {
        return res.json({
            success: false,
            msg : "veuillez saisir un département valide ! ( 3 caractere minimum )"
        });
    }

    req.getConnection((err, connection) => {
        // si en production, on utilise WINSTON.
        if(err) throw err.stack;

        const uniqId = uniqid.time(); // il genere 8 bytes.

        connection.query(`insert into employees set id = ?,
                                            name = ?, 
                                            firstName = ?, 
                                            dateCreated = CURRENT_DATE, 
                                            department = ?`,
                            [
                                uniqId,
                                name,
                                firstName,
                                department
                            ],
                            function(err, rows, fields) {
                                if(err) throw err.stack;
                                // add it to BDD.
                                res.json({
                                    success: true,
                                    msg : "Added successfully"
                                });
                            });
        // * connection se ferme toute seule :D
    });
}

exports.getEmployees = async (req, res) => {
    // todo - [X] récuperer la liste des employees
    // todo - [X] ajouter un filtre selon la date de création
    // on recupere la date si elle existe en query. ( c'est un GET )
    let {
        date
    } = req.query;

    let sql = `select * from employees`;
    let concatSql = ``;
    
    if(date) {
        // on verifie si la date est vraiment une date.
        if(validator.isDate(date)) {
            date = mysql.escape(date); // ne pas faire confiance au Client ^^.
            concatSql = ` where employees.dateCreated = ${date}`;
        }
    }

    req.getConnection((err, connection) => {
        if(err) throw err.stack;
        // recuperer tous les employees
        connection.query(sql+concatSql,[],function(err, rows, fields) {
            if(err) throw err.stack;
            res.json({
                success: true,
                employees : rows
            });
        });
    });
}

exports.checkin = async (req, res) => {
    // * on pourrait verifier dabord si le client existe ou pas, mais c'est pas précisé.
    // * je le fais avec une seule requete c'est mieux :D
    // todo - [X] si l'id user existe.
    // todo - [X] attribuer la date du checkin.
    // todo - [X] s'il ya un comment, le sauvgarder.
    const {
        employeeId,
        comment // je pense que le comment il peut etre vide
    } = req.body; 

    // verifier si id de lemploye a bien été saisi.
    if(!employeeId) {
        return res.json({
            success : false,
            msg : "Error params incorrect !"
        });
    }

    req.getConnection((err, connection) => {
        if(err) throw err.stack;
        // un employee a plusieurs pointage.
        // donc chaque ligne correspondra a 1 journée de travail.
        // fonctionnement : 
        // cette requette insere une ligne seulement si c'est une nouvelle journée. sinon il update l'ancienne :D
        // et si il y'a un commentaire on l'insere aussi :D
        connection.query(`INSERT INTO pointages (fk_id_employee, checkin, commentaire) 
                            SELECT ?, now(),? FROM DUAL 
                            WHERE NOT EXISTS (SELECT * FROM pointages 
                                WHERE fk_id_employee=? AND date_format(checkin, "%Y-%m-%e")=CURRENT_DATE LIMIT 1)`,
                            [
                                employeeId,
                                comment,
                                employeeId
                            ],function(err, rows, fields) {
                                if(err) throw err.stack;
                                res.json({
                                    success : true,
                                    msg : "bien"
                                })
                            });
    });
}

exports.checkout = async (req, res) => {
    // todo - [X] attribuer la date du checkout. si existe
    // todo - [X] s'il ya un comment, le sauvgarder.
    // todo - [X] calculer le temps entre le checkIn & le checkOut et le sauvegarder (BONUS)
    const {
        employeeId,
        comment // je pense que le comment il peut etre vide
    } = req.body; 

    // verifier si id de lemploye a bien été saisi.
    if(!employeeId) {
        return res.json({
            success : false,
            msg : "Error params incorrect !"
        });
    }

    req.getConnection((err, connection) => {
        if(err) throw err.stack;
        // recuperer la ligne concernee.
        connection.query(`select * from pointages where fk_id_employee = ? and date_format(checkin, "%Y-%m-%e") = CURRENT_DATE`,
                            [
                                employeeId,
                            ],function(err, rows, fields) {
                                if(err) throw err.stack;
                                if(rows.length) {
                                    // recuperer les infos de la ligne.
                                    let {
                                        id,
                                        checkin,
                                        commentaire
                                    } = rows[0];

                                    // si un comment est envoyé, alors on update l'ancien commentaire.
                                    if(comment) {
                                        commentaire = comment;
                                    }
                                    // update la ligne avec le nouveau checkout
                                    // update la ligne avec le nouveau commentaire si y'en a 
                                    // [BONUS] update les heures de travail de l'employee 
                                    connection.query(`update pointages set checkout = now(), hours_worked = TIMEDIFF(now(),?), commentaire = ? where id = ?`,
                                    [
                                        checkin,
                                        commentaire,
                                        id
                                    ],
                                    function(err, rows, fields) {
                                        if(err) throw err.stack;
                                        res.json({
                                            success : true,
                                            msg : "bien modifier"
                                        });
                                    })

                                }else{
                                    res.json({
                                        success : true,
                                        msg : "empty rows"
                                    })
                                }
                            });
    });
}
