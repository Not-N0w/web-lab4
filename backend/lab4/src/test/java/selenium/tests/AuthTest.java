package selenium.tests;

import org.junit.jupiter.api.Test;
import resources.ConfProperties;
import selenium.pages.HomePage;
import selenium.pages.LoginPage;
import selenium.pages.RegistrationPage;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import static org.junit.jupiter.api.Assertions.*;

public class AuthTest extends selenium.tests.BaseTest {
    @Test
    void registration_success() {
        String username = "user" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
        String password = "pass";

        new LoginPage(dr()).moveToRegistration().registration(username, password, password);
        assertEquals(username, new HomePage(dr()).getUsername());
    }

    @Test
    void logout() {
        String username = ConfProperties.getProperty("username");
        String password = ConfProperties.getProperty("password");
        new LoginPage(dr()).login(username, password).logout();
    }

    @Test
    void registration_fail_usernameExists() {
        String username = ConfProperties.getProperty("username");
        String password = ConfProperties.getProperty("password");

        RegistrationPage registrationPage = new LoginPage(dr()).moveToRegistration();
        registrationPage.registration(username, password, password);
        assertEquals("Username already exists.", registrationPage.getUsernameErrorMessage());
        assertFalse(dr().getCurrentUrl().contains("page_url"));
    }

    @Test
    void login_success() {
        String username = ConfProperties.getProperty("username");
        String password = ConfProperties.getProperty("password");

        new LoginPage(dr()).login(username, password);
        assertEquals(username, new HomePage(dr()).getUsername());
    }
}
