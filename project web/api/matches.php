<?php

header("Content-Type: application/json");
include 'db_connect.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    
    $sql = "SELECT * FROM matches ORDER BY date DESC";
    $result = $conn->query($sql);
    
    $matches = [];
    while($row = $result->fetch_assoc()) {
        $matches[] = $row;
    }
    
    echo json_encode($matches);
    exit;
}

//Add a new match
if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    $date = $data['date'];
    $opponent = $data['opponent'];
    $location = $data['location'];
    $status = $data['status'];
    $score_us = $data['scoreUs'] ?? 0;
    $score_them = $data['scoreThem'] ?? 0;

    $stmt = $conn->prepare("INSERT INTO matches (date, opponent, location, status, score_us, score_them) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssii", $date, $opponent, $location, $status, $score_us, $score_them);

    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "error" => $conn->error]);
    }
    
    $stmt->close();
    exit;
}

//Remove a match ---
if ($method === 'DELETE') {
    $data = json_decode(file_get_contents("php://input"), true);
    $id = $data['id'];

    $stmt = $conn->prepare("DELETE FROM matches WHERE id = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "error" => $conn->error]);
    }
    
    $stmt->close();
    exit;
}

if ($method === 'PUT') {
    $data = json_decode(file_get_contents("php://input"), true);

    $id = $data['id'];
    $date = $data['date'];
    $opponent = $data['opponent'];
    $location = $data['location'];
    $status = $data['status']; 
    $score_us = $data['score_us'] ?? 0;
    $score_them = $data['score_them'] ?? 0;

    $stmt = $conn->prepare("UPDATE matches SET date=?, opponent=?, location=?, status=?, score_us=?, score_them=? WHERE id=?");
    $stmt->bind_param("ssssiii", $date, $opponent, $location, $status, $score_us, $score_them, $id);

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