<?php
header("Content-Type: application/json");
include 'db_connect.php';

$data = json_decode(file_get_contents("php://input"), true);

$username = $data['username'] ?? '';
$password = $data['password'] ?? '';
$role = $data['role'] ?? 'user'; 

if (empty($username) || empty($password)) {
    echo json_encode(["success" => false, "message" => "Please fill all fields."]);
    exit;
}

$table = ($role === 'admin') ? 'admins' : 'users';
$check = $conn->prepare("SELECT id FROM $table WHERE username = ?");
$check->bind_param("s", $username);
$check->execute();
if ($check->get_result()->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "Username already taken."]);
    exit;
}

$hashed_password = password_hash($password, PASSWORD_DEFAULT);

$stmt = $conn->prepare("INSERT INTO $table (username, password) VALUES (?, ?)");
$stmt->bind_param("ss", $username, $hashed_password);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Registration successful!"]);
} else {
    echo json_encode(["success" => false, "message" => "Error registering user."]);
}

$stmt->close();
$conn->close();
?>