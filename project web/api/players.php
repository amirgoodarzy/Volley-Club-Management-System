<?php

header("Content-Type: application/json");
include 'db_connect.php';

$method = $_SERVER['REQUEST_METHOD'];

//Fetch all players
if ($method === 'GET') {
    $sql = "SELECT * FROM players ORDER BY number ASC";
    $result = $conn->query($sql);
    
    $players = [];
    while($row = $result->fetch_assoc()) {
        $players[] = $row;
    }
    
    echo json_encode($players);
    exit;
}

//Add a new player
if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    $name = $data['name'];
    $number = $data['number'];
    $position = $data['position'];
    $height = $data['height'];
    $image = $data['image'] ?? 'default.png';

    $stmt = $conn->prepare("INSERT INTO players (name, number, position, height, image) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sisss", $name, $number, $position, $height, $image);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Player added!"]);
    } else {
        echo json_encode(["success" => false, "error" => $conn->error]);
    }
    
    $stmt->close();
    exit;
}

// Remove a player
if ($method === 'DELETE') {
    $data = json_decode(file_get_contents("php://input"), true);
    $id = $data['id'];

    $stmt = $conn->prepare("DELETE FROM players WHERE id = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "error" => $conn->error]);
    }
    
    $stmt->close();
    exit;
}
//Update existing player
if ($method === 'PUT') {
    $data = json_decode(file_get_contents("php://input"), true);

    $id = $data['id'];
    $name = $data['name'];
    $number = $data['number'];
    $position = $data['position'];
    $height = $data['height'];

    $stmt = $conn->prepare("UPDATE players SET name=?, number=?, position=?, height=? WHERE id=?");
    $stmt->bind_param("sissi", $name, $number, $position, $height, $id);

    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "error" => $conn->error]);
    }
    $stmt->close();
    exit;
}

$conn->close();
?>