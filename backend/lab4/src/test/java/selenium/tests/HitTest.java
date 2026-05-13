package selenium.tests;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import resources.ConfProperties;
import selenium.pages.HomePage;
import selenium.pages.LoginPage;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class HitTest extends selenium.tests.BaseTest {

    @BeforeEach
    public void setUp() {
        String username = ConfProperties.getProperty("username");
        String password = ConfProperties.getProperty("password");
        new LoginPage(dr()).login(username, password);

        HomePage homePage = new HomePage(dr());
        homePage.setR("1");
    }

    @Test
    public void hit_success() {
        HomePage homePage = new HomePage(dr());
        homePage.setX("-0.5");
        homePage.setY("0.5");
        homePage.hit();

        String x = homePage.getHitFieldTitle(0,0);
        String y = homePage.getHitFieldTitle(0,1);
        String r = homePage.getHitFieldTitle(0,2);
        String hit = homePage.getHitField(0,3);

        assertEquals("-0.5", x);
        assertEquals("0.5", y);
        assertEquals("1", r);
        assertEquals("true", hit);
    }

    @Test
    public void hit_fail() {
        HomePage homePage = new HomePage(dr());
        homePage.setX("1");
        homePage.setY("1");
        homePage.hit();

        String x = homePage.getHitFieldTitle(0,0);
        String y = homePage.getHitFieldTitle(0,1);
        String r = homePage.getHitFieldTitle(0,2);
        String hit = homePage.getHitField(0,3);

        assertEquals("1", x);
        assertEquals("1", y);
        assertEquals("1", r);
        assertEquals("false", hit);
    }

    @Test
    public void hitPlot_inArea() {
        HomePage homePage = new HomePage(dr());

        homePage.clickOnCanvas(-25, 25);
        homePage.waitForTableUpdate(homePage.getTableContent());

        String r = homePage.getHitFieldTitle(0,2);
        String hit = homePage.getHitField(0,3);

        assertEquals("1", r);
        assertEquals("true", hit);
    }

    @Test
    public void hitPlot_outArea() {
        HomePage homePage = new HomePage(dr());

        homePage.clickOnCanvas(25, -25);
        homePage.waitForTableUpdate(homePage.getTableContent());

        String r = homePage.getHitFieldTitle(0,2);
        String hit = homePage.getHitField(0,3);

        assertEquals("1", r);
        assertEquals("false", hit);
    }

    @Test
    public void longNumberHit() {
        HomePage homePage = new HomePage(dr());
        homePage.setX("1");
        homePage.setY("0.1784712471984");
        homePage.hit();
        homePage.waitForTableUpdate(homePage.getTableContent());

        String titleY = homePage.getHitFieldTitle(0,1);
        String textY = homePage.getHitField(0,1);

        String[] parts= textY.split("\\.\\.\\.");
        String titleYPrefix = titleY.substring(0, parts[0].length());
        String titleYSuffix = titleY.substring(titleY.length() - parts[1].length());

        assertEquals(titleYPrefix, parts[0]);
        assertEquals(titleYSuffix, parts[1]);
    }

    @Test
    public void clearTable() {
        HomePage homePage = new HomePage(dr());
        homePage.setX("0");
        homePage.setY("0");
        homePage.hit();

        homePage.setX("1");
        homePage.setY("1");
        homePage.hit();

        homePage.clear();
        homePage.waitForTableUpdate(homePage.getTableContent());
        assertEquals(0, homePage.getHitCount());
    }

    @Test
    public void yRestrictions() {
        HomePage homePage = new HomePage(dr());
        homePage.setY("4");
        String msg = homePage.waitForYFailureMessage();
        assertTrue(msg.contains("Y"));

        homePage.setY("4");
        msg = homePage.waitForYFailureMessage();
        assertTrue(msg.contains("Y"));
    }

    @Test
    public void xRestrictions() {
        HomePage homePage = new HomePage(dr());
        homePage.setX("-10");
        String msg= homePage.waitForXFailureMessage();
        assertTrue(msg.contains("X"));

        homePage.setX("0.51");
        msg = homePage.waitForXFailureMessage();
        assertTrue(msg.contains("X"));
    }

    @Test
    public void rRestrictions() {
        HomePage homePage = new HomePage(dr());
        homePage.setR("-10");
        String msg= homePage.waitForRFailureMessage();
        assertTrue(msg.contains("R"));

        homePage.setR("0.51");
        msg = homePage.waitForRFailureMessage();
        assertTrue(msg.contains("R"));
    }

    @Test
    public void pagination() {
        HomePage homePage = new HomePage(dr());
        homePage.setX("0");
        homePage.setY("0");
        for(int i = 0; i < 9; i++) {
            homePage.hit();
        }
        String msg = homePage.waitForSecondPageButton();
        assertEquals("2", msg);
    }

    @Test
    public void correctHitsForEachUser() {
        HomePage homePage = new HomePage(dr());
        homePage.setX("1");
        homePage.setY("1");
        homePage.hit();

        homePage.logout();

        String username = "user" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
        String password = "pass";

        new LoginPage(dr()).moveToRegistration().registration(username, password, password);

        HomePage homePage2 = new HomePage(dr());
        assertEquals(0, homePage2.getHitCount());
    }
}
