<?php
header("Content-Type: application/json");

// Config
define("API_KEY", "3e04f8c2-5d4b-4f11-94d8-a5b79f4d123a");
define("DB_PATH", "/home/happywallpaints/mobilesync/amazonaDB.db");

// CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, X-API-KEY, API_KEY");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Auth
$auth = $_SERVER['HTTP_X_API_KEY'] ?? null;
if ($auth !== API_KEY) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Unauthorized']);
    exit;
}

try {
    $table = $_GET['table'] ?? '';

    if (!$table || !preg_match('/^[a-zA-Z0-9_]+$/', $table)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Invalid or missing table name']);
        exit;
    }

    file_put_contents('/home/happywallpaints/tmp/log_failed_tables.txt', "Requested table: $table\n", FILE_APPEND);

    $db = new PDO("sqlite:" . DB_PATH);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $db->query("SELECT * FROM `$table`");
    if (!$stmt) {
        throw new Exception("Query failed for table `$table`");
    }

    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    file_put_contents('/home/happywallpaints/tmp/api_debug.log', "Fetched " . count($data) . " rows from $table\n", FILE_APPEND);

    // Sanitize UTF-8
    array_walk_recursive($data, function (&$value) {
        if (is_string($value)) {
            $value = mb_convert_encoding($value, 'UTF-8', 'UTF-8');
        }
    });

    $result = json_encode(['success' => true, 'data' => $data]);

    if ($result === false) {
        $errorMsg = json_last_error_msg();
        file_put_contents('/home/happywallpaints/tmp/api_debug.log', "json_encode failed: $errorMsg\n", FILE_APPEND);
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'JSON encode failed: ' . $errorMsg]);
        exit;
    }

    echo $result;

} catch (Exception $e) {
    file_put_contents('/home/happywallpaints/tmp/api_debug.log', "ERROR in $table: " . $e->getMessage() . "\n", FILE_APPEND);
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage() ?: 'Unknown error occurred']);
}
