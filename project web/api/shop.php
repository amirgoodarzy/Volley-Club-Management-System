<?php

header("Content-Type: application/json");
include 'db_connect.php';

$method = $_SERVER['REQUEST_METHOD'];

// Fetch all products
if ($method === 'GET') {
    $sql = "SELECT * FROM products ORDER BY id DESC";
    $result = $conn->query($sql);
    
    $products = [];
    while($row = $result->fetch_assoc()) {
        $products[] = $row;
    }
    
    echo json_encode($products);
    exit;
}

// Add 
if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    $name = $data['name'];
    $category = $data['category'];
    $price = $data['price'];
    $image = $data['image'] ?? 'default_product.png';

    $stmt = $conn->prepare("INSERT INTO products (name, category, price, image) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssds", $name, $category, $price, $image);

    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "error" => $conn->error]);
    }
    
    $stmt->close();
    exit;
}

// UPDATE
if ($method === 'PUT') {
    $data = json_decode(file_get_contents("php://input"), true);

    $id = $data['id'];
    $name = $data['name'];
    $category = $data['category'];
    $price = $data['price'];
    
    if (empty($id)) {
        echo json_encode(["success" => false, "error" => "No ID provided"]);
        exit;
    }

    $stmt = $conn->prepare("UPDATE products SET name=?, category=?, price=? WHERE id=?");
    $stmt->bind_param("ssdi", $name, $category, $price, $id);

    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "error" => $conn->error]);
    }
    $stmt->close();
    exit;
}

//Remove product ---
if ($method === 'DELETE') {
    $data = json_decode(file_get_contents("php://input"), true);
    $id = $data['id'];

    $stmt = $conn->prepare("DELETE FROM products WHERE id = ?");
    $stmt->bind_param("i", $id);

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