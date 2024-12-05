package com.myproject.tests;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.testng.Assert;
import org.testng.annotations.*;

public class LoginTest {

    WebDriver driver;

    @BeforeClass
    public void setup() {
        // You can use WebDriverManager to handle the driver automatically (recommended)
        // WebDriverManager.chromedriver().setup();
        
        // If you prefer to manually set up the driver path:
        System.setProperty("webdriver.chrome.driver", "resources/chromedriver.exe");
        driver = new ChromeDriver();
    }

    @Test
    public void testLoginPageTitle() {
        driver.get("https://www.example.com/login");
        
        String pageTitle = driver.getTitle();
        Assert.assertEquals(pageTitle, "Login Page");
    }

    @Test
    public void testLoginFunctionality() {
        driver.get("https://www.example.com/login");

        // Assuming the login form has fields with ids "username" and "password", and a submit button with the id "loginBtn"
        WebElement usernameField = driver.findElement(By.id("username"));
        WebElement passwordField = driver.findElement(By.id("password"));
        WebElement loginButton = driver.findElement(By.id("loginBtn"));

        usernameField.sendKeys("testuser");
        passwordField.sendKeys("testpassword");
        loginButton.click();

        // Assuming successful login redirects to the dashboard page
        String currentUrl = driver.getCurrentUrl();
        Assert.assertEquals(currentUrl, "https://www.example.com/dashboard");
    }

    @AfterClass
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
}
