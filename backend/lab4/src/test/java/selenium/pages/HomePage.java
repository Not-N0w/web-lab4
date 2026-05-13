package selenium.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.math.BigDecimal;
import java.time.Duration;
import java.util.List;

public class HomePage {
    private final WebDriver driver;

    public HomePage(WebDriver driver) {
        this.driver = driver;
        PageFactory.initElements(driver, this);

        new WebDriverWait(driver, Duration.ofSeconds(10))
                .until(ExpectedConditions.visibilityOf(username));
    }

    @FindBy(css = ".info-name")
    WebElement username;

    @FindBy(css = ".info-group button")
    WebElement logoutButton;

    @FindBy(css = "input[formcontrolname='x']")
    WebElement xInput;

    @FindBy(css = "input[formcontrolname='y']")
    WebElement yInput;

    @FindBy(css = "input[formcontrolname='r']")
    WebElement rInput;

    @FindBy(css = "button[type='submit']")
    WebElement hitButton;

    @FindBy(css = "table tbody tr")
    List<WebElement> hits;

    @FindBy(css = "canvas")
    WebElement canvas;

    @FindBy(css=".clear-button-wrapper button")
    WebElement clearButton;

    @FindBy(css = "form .form-item:nth-child(2) p-message[severity='error'] span")
    WebElement yErrorMessage;

    @FindBy(css = "form .form-item:nth-child(1) p-message[severity='error'] span")
    WebElement xErrorMessage;

    @FindBy(css = "form .form-item:nth-child(3) p-message[severity='error'] span")
    WebElement rErrorMessage;

    @FindBy(css = "p-table button[aria-label='2']")
    WebElement secondPageButton;

    public void setX(String x) {
        xInput.clear();
        xInput.sendKeys(x);
    }
    public void setY(String y) {
        yInput.clear();
        yInput.sendKeys(y);
    }
    public void setR(String r) {
        rInput.clear();
        rInput.sendKeys(r);
    }

    public void hit() {
        hitButton.click();
    }

    public String getUsername() {
        return username.getText();
    }

    public LoginPage logout() {
        logoutButton.click();

        return new LoginPage(driver);
    }

    public String getHitField(int rowIndex, int columnIndex) {
        if (rowIndex < 0 || rowIndex >= hits.size()) {
            throw new IndexOutOfBoundsException("Нет строки с индексом " + rowIndex);
        }

        WebElement row = hits.get(rowIndex);
        return row.findElements(By.tagName("td")).get(columnIndex).getText().trim();
    }

    public String getHitFieldTitle(int rowIndex, int columnIndex) {
        if (rowIndex < 0 || rowIndex >= hits.size()) {
            throw new IndexOutOfBoundsException("Нет строки с индексом " + rowIndex);
        }

        WebElement row = hits.get(rowIndex);
        return row.findElements(By.tagName("td")).get(columnIndex).getAttribute("title");
    }

    public int getHitCount() {
        return hits.size();
    }
    public List<WebElement> getHits() {
        return hits;
    }

    public void clickOnCanvas(int xOffset, int yOffset) {
        new Actions(driver)
                .moveToElement(canvas, xOffset, yOffset)
                .click()
                .perform();
    }

    public String getTableContent() {
        return driver.findElement(By.cssSelector("table tbody")).getText();
    }

    public void waitForTableUpdate(String oldContent) {
        System.out.println(driver.findElement(By.cssSelector("table tbody")).getText());

        new WebDriverWait(driver, Duration.ofSeconds(10))
                .until(d -> !getTableContent().equals(oldContent));

        System.out.println("\n" + driver.findElement(By.cssSelector("table tbody")).getText());

    }
    public void clear() {
        clearButton.click();
    }

    public String waitForYFailureMessage() {
        new WebDriverWait(driver, Duration.ofSeconds(10))
                .until(ExpectedConditions.visibilityOf(yErrorMessage));
        return yErrorMessage.getText();
    }

    public String waitForXFailureMessage() {
        new WebDriverWait(driver, Duration.ofSeconds(10))
                .until(ExpectedConditions.visibilityOf(xErrorMessage));
        return xErrorMessage.getText();
    }

    public String waitForRFailureMessage() {
        new WebDriverWait(driver, Duration.ofSeconds(10))
                .until(ExpectedConditions.visibilityOf(rErrorMessage));
        return rErrorMessage.getText();
    }

    public String waitForSecondPageButton() {
        new WebDriverWait(driver, Duration.ofSeconds(10))
                .until(ExpectedConditions.visibilityOf(secondPageButton));
        return secondPageButton.getText();
    }

}
