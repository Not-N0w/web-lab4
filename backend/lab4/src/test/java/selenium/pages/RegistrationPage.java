package selenium.pages;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import resources.ConfProperties;

import java.time.Duration;

public class RegistrationPage {

    private final WebDriver driver;

    @FindBy(id = "username")
    WebElement username;

    @FindBy(id = "password")
    WebElement password;

    @FindBy(xpath = "//input[@type='submit']")
    WebElement registrationButton;

    @FindBy(id ="password-confirm")
    WebElement passwordConfirm;

    @FindBy(css ="#kc-form-options a")
    WebElement loginLink;

    @FindBy(css="#input-error-username span")
    WebElement usernameError;

    public RegistrationPage(WebDriver driver) {
        this.driver = driver;
        PageFactory.initElements(driver, this);

        new WebDriverWait(driver, Duration.ofSeconds(10))
                .until(ExpectedConditions.urlContains(ConfProperties.getProperty("registration_page_url")));
    }

    public void registration(String username, String password, String passwordConfirmation) {
        this.username.sendKeys(username);
        this.password.sendKeys(password);
        this.passwordConfirm.sendKeys(passwordConfirmation);
        registrationButton.click();
    }

    public void moveToLogin() {
        loginLink.click();
    }

    public String getUsernameErrorMessage() {
        new WebDriverWait(driver, Duration.ofSeconds(10))
                .until(ExpectedConditions.visibilityOf(usernameError));
        try {
            return usernameError.getText();
        } catch (Exception e) {
            return null;
        }
    }
}
