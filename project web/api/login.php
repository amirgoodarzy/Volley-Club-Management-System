<?php
header("Content-Type: application/json");
include 'db_connect.php';

$data = json_decode(file_get_contents("php://input"), true);

$user = $data['username'] ?? '';
$pass = $data['password'] ?? '';
$role = $data['role'] ?? 'user'; 

if (empty($user) || empty($pass)) {
    echo json_encode(["success" => false, "message" => "Please enter both fields."]);
    exit;
}

$table = ($role === 'admin') ? 'admins' : 'users';

$stmt = $conn->prepare("SELECT id, username, password FROM $table WHERE username = ?");
$stmt->bind_param("s", $user);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    
    
    if (password_verify($pass, $row['password'])) {
        echo json_encode([
            "success" => true, 
            "username" => $row['username'],
            "role" => $role,
            "message" => "Login successful!"
        ]);
    } else {
        echo json_encode(["success" => false, "message" => "Incorrect password."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "User not found."]);
}

$stmt->close();
$conn->close();
?>