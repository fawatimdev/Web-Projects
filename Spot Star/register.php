<?php
// Start session
session_start();

// الاتصال بقاعدة البيانات
include 'db.php';

// التحقق من عملية التسجيل
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['register'])) {
  $fullname = $_POST['fullname'];
  $email = $_POST['email'];
  $password = password_hash($_POST['password'], PASSWORD_DEFAULT);

  $stmt = $conn->prepare("INSERT INTO users (fullname, email, password) VALUES (?, ?, ?)");
  $stmt->bind_param("sss", $fullname, $email, $password);

  if ($stmt->execute()) {
    $_SESSION['message'] = "Registration successful!";
    header("Location: index.html");
    exit();
  } else {
    $_SESSION['message'] = "Error: " . $stmt->error;
  }

  $stmt->close();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Register | Spot Star</title>
  <link rel="stylesheet" href="style.css"/>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"/>
</head>
<body>

  <!-- Header/Navbar -->
  <header>
    <div class="container nav-container">
      <div class="logo"><i class="fas fa-star"></i> Spot Star</div>
      <nav>
        <ul class="nav-links">
          <li><a href="index.html">Home</a></li>
          <li><a href="about.html">About</a></li>
          <li><a href="hotels.html">Hotels & Villas</a></li>
          <li><a href="flights.html">Flights</a></li>
          <li><a href="blog.html">Blog</a></li>
          <li><a href="register.php" class="active">Register</a></li>
        </ul>
      </nav>
    </div>
  </header>

  <!-- Register Section -->
  <main class="register-section">
    <div class="container form-container">
      <h1><i class="fas fa-user-plus"></i> Register or Sign In</h1>
      <p>Create a new account or login to manage your bookings and preferences.</p>

      <?php if (isset($_SESSION['message'])): ?>
        <p class="message"><?= $_SESSION['message'] ?></p>
        <?php unset($_SESSION['message']); ?>
      <?php endif; ?>

      <form class="auth-form" method="POST" action="register.php">
        <div class="input-group">
          <label for="fullname"><i class="fas fa-user"></i> Full Name</label>
          <input type="text" id="fullname" name="fullname" required placeholder="Your Name">
        </div>

        <div class="input-group">
          <label for="email"><i class="fas fa-envelope"></i> Email Address</label>
          <input type="email" id="email" name="email" required placeholder="your@email.com">
        </div>

        <div class="input-group">
          <label for="password"><i class="fas fa-lock"></i> Password</label>
          <input type="password" id="password" name="password" required placeholder="Enter Password">
        </div>

        <div class="form-actions">
          <button type="submit" name="register" class="register-btn"><i class="fas fa-user-plus"></i> Register</button>
          <button type="button" class="login-btn"><i class="fas fa-sign-in-alt"></i> Sign In</button>
        </div>
      </form>
    </div>
  </main>

  <!-- Footer -->
  <footer>
    <div class="footer-columns">
      <div>
        <h4>Company</h4>
        <ul>
          <li><a href="#">About Us</a></li>
          <li><a href="#">Careers</a></li>
          <li><a href="#">Add your Property</a></li>
          <li><a href="#">Contact Us</a></li>
        </ul>
      </div>
      <div>
        <h4>Help</h4>
        <ul>
          <li><a href="#">FAQ</a></li>
          <li><a href="#">Terms of Use</a></li>
          <li><a href="#">Privacy Policy</a></li>
          <li><a href="#">File a claim</a></li>
        </ul>
      </div>
      <div>
        <h4>Subscribe</h4>
        <input type="email" placeholder="Enter email">
        <button class="subscribe-btn">Subscribe</button>
      </div>
    </div>
    <p class="copyright">© 2025 Saudi Ebreez Company</p>
  </footer>

</body>
</html>