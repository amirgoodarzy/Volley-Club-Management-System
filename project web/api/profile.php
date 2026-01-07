<?php
header("Content-Type: application/json");
include 'db_connect.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    $username = $data['username'];
    $item_name = $data['item_name'];
    $category = $data['category']; 
    $price = $data['price'];

    $stmt = $conn->prepare("INSERT INTO user_orders (username, item_name, category, price) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("sssd", $username, $item_name, $category, $price);

    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "error" => $conn->error]);
    }
    exit;
}

if ($method === 'GET') {
    $username = $_GET['username'];

    $stmt = $conn->prepare("SELECT * FROM user_orders WHERE username = ? ORDER BY date DESC");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    $history = [];
    while($row = $result->fetch_assoc()) {
        $history[] = $row;
    }

    echo json_encode($history);
    exit;
}
?>