// src/controllers/adminController.js
import pool from "../config/db.js";

export async function CheckAccess(req,res){
  const userId = req.user.userId
  try{
    const [rows] = await pool.query(
      `select role_id from users where user_id = ?`,[userId]
    );
    let Access = false;
    if( rows[0]?.role_id == 1) Access = true
    res.json({
      role : Access
    })
    
  }catch(err){
   res.status(500).json({ message: err.message });
  }
}