package SeleniumProject.Maven;


import java.util.concurrent.TimeUnit;
import org.junit.Test;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import io.github.bonigarcia.wdm.WebDriverManager;

public class AppTest 
{ 
	public WebDriver driver; 
	public String baseUrl = "https://www.lambdatest.com/";  
	
	@Test             
	public void test1() {      
		
		WebDriverManager.chromedriver().setup();
		ChromeOptions options = new ChromeOptions();
		options.addArguments("--no-sandbox");
		options.addArguments("--disable-dev-shm-usage");
		options.addArguments("--headless");
		driver = new ChromeDriver(options);
 
		driver.manage().timeouts().implicitlyWait(20,TimeUnit.SECONDS);  
		driver.manage().window().maximize();  
		driver.get(baseUrl);
		driver.close();
	}     
}
