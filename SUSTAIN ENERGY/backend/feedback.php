<?php
// Simple placeholder handler for feedback.
$name = isset($_POST["name"]) ? trim($_POST["name"]) : "";
$email = isset($_POST["email"]) ? trim($_POST["email"]) : "";
$phone = isset($_POST["phone"]) ? trim($_POST["phone"]) : "";
$comments = isset($_POST["comments"]) ? trim($_POST["comments"]) : "";

header("Content-Type: text/plain");

echo "Feedback received.\n";
echo "Name: " . $name . "\n";
echo "Email: " . $email . "\n";
echo "Phone: " . $phone . "\n";
echo "Comments: " . $comments . "\n";
echo "This is a placeholder script for the project skeleton.\n";
?>
