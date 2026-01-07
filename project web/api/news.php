<?php
header("Content-Type: application/json");
include 'db_connect.php';

$method = $_SERVER['REQUEST_METHOD'];

//Fetch all news 
if ($method === 'GET') {
    
    $sql = "SELECT * FROM news ORDER BY date DESC";
    $result = $conn->query($sql);
    
    $newsList = [];
    while($row = $result->fetch_assoc()) {
        $newsList[] = $row;
    }
    
    echo json_encode($newsList);
    exit;
}

// Add new article
if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    $date = $data['date'];
    $title = $data['title'];
    $category = $data['category'];
    $content = $data['content'] ?? ''; 
    $image = $data['image'] ?? 'default_news.png';

    $stmt = $conn->prepare("INSERT INTO news (date, title, category, content, image) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssss", $date, $title, $category, $content, $image);

    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "error" => $conn->error]);
    }
    
    $stmt->close();
    exit;
}

//Remove article
if ($method === 'DELETE') {
    $data = json_decode(file_get_contents("php://input"), true);
    $id = $data['id'];

    $stmt = $conn->prepare("DELETE FROM news WHERE id = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "error" => $conn->error]);
    }
    
    $stmt->close();
    exit;
}
// Update news article
if ($method === 'PUT') {
    $data = json_decode(file_get_contents("php://input"), true);

    $id = $data['id'];
    $title = $data['title'];
    $category = $data['category'];
    $content = $data['content'];

    $stmt = $conn->prepare("UPDATE news SET title=?, category=?, content=? WHERE id=?");
    $stmt->bind_param("sssi", $title, $category, $content, $id);

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