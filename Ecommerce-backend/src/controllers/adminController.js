// src/controllers/adminController.js
import pool from "../config/db.js";

export async function logAction(adminId, actionType, description) {
  try {
    await pool.query("INSERT INTO admin_actions (admin_id, action_type, description) VALUES (?, ?, ?)", [adminId, actionType, description]);
  } catch (err) {
    console.error("Failed to log admin action:", err.message);
  }
}

export async function getAdminLogs(req, res) {
  try {
    const [rows] = await pool.query("SELECT a.*, u.full_name FROM admin_actions a JOIN users u ON a.admin_id = u.user_id ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
}

export async function CheckAccess(req,res){
  const userId = req.user.userId
  try{
    const [rows] = await pool.query(
      `select role_id from users where user_id = ?`,[userId]
    );
    let Access = false;
    if( rows?.role_id == 1) Access = true
    res.json({
      role : Access
    })
    
  }catch(err){
   res.status(500).json({ message: err.message });
  }
}