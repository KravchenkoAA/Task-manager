package com.gmail.taskmanager.mail;

import com.gmail.taskmanager.dto.FriendDTO;
import com.gmail.taskmanager.dto.TaskDTO;
import com.gmail.taskmanager.dto.TaskToNotifyDTO;
import com.gmail.taskmanager.dto.UserDTO;
import com.gmail.taskmanager.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GoogleEmailSender implements EmailSender {
    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String emailSender;

    @Value("${host.redirect.url}")
    private String url;

    @Override
    public void sendEmailForActivation(User user) {
        SimpleMailMessage mailMessage = new SimpleMailMessage();

        mailMessage.setFrom(emailSender);
        mailMessage.setTo(user.getUsername());
        mailMessage.setSubject("Благодарим за регистрацию");
        mailMessage.setText(
                String.format("%s, благодарим за регистрацию в Task Manager! " + '\n' + '\n' +
                        "Для того, чтобы завершить регистрацию, пожалуйста, перейдите по ссылке: %suser/activate?code=%s" + '\n' + '\n' + '\n' +
                        "Спасибо," + '\n' + "Приложение Task Manager", user.getName(), url, user.getActivationCode()
                ));

        mailSender.send(mailMessage);
    }

    @Override
    public void sendEmailNotification(TaskToNotifyDTO task) {
        SimpleMailMessage mailMessage = new SimpleMailMessage();

        mailMessage.setFrom(emailSender);
        mailMessage.setTo(task.getUsername());
        mailMessage.setSubject("Напоминаем Вам о важном деле!");
        mailMessage.setText(
                String.format("Уважаемый %s!" + '\n' +
                                "Хотим Вам напомнить о важных планах:" + '\n' +
                                "Тема: %s" + '\n' +
                                "Приоритет: %s" + '\n' +
                                "Время завершения: %s" + '\n' +
                                "Описание: %s" + '\n' + '\n' + '\n' +
                                "Приложение Task Manager",
                        task.getName(), task.getTitle(), task.getPriority(), task.getDateFinish(), task.getDescription()
                ));

        mailSender.send(mailMessage);
    }

    @Override
    public void sendEmailAboutComment(UserDTO authorTask, TaskDTO task) {
        SimpleMailMessage mailMessage = new SimpleMailMessage();

        mailMessage.setFrom(emailSender);
        mailMessage.setTo(authorTask.getUsername());
        mailMessage.setSubject("Новый комментарий");
        mailMessage.setText(
                String.format(
                        "Уважаемый %s!" + '\n' +
                                "Кто-то из товарищей добавил коментарий к вашей задаче: %s." + '\n' + '\n' + '\n' +
                                "Приложение Task Manager",
                        authorTask.getName(), task.getTitle()
                ));

        mailSender.send(mailMessage);
    }

    @Override
    public void sendEmailAboutSharedTask(UserDTO authorTask, List<FriendDTO> friends) {
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setFrom(emailSender);

        for (FriendDTO tempFriend : friends) {
            mailMessage.setTo(tempFriend.getUsername());
            mailMessage.setSubject("Новая задача");
            mailMessage.setText(
                    String.format(
                            "Уважаемый %s!" + '\n' +
                                    "%s поделился с вами своей задачей" + '\n' + '\n' + '\n' +
                                    "Приложение Task Manager",
                            tempFriend.getName(), authorTask.getName()
                    ));
            mailSender.send(mailMessage);
        }
    }

    @Override
    public void sendEmailAboutComment(UserDTO authorTask, List<FriendDTO> friends, TaskDTO task) {
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setFrom(emailSender);

        for (FriendDTO tempFriend : friends) {
            mailMessage.setTo(tempFriend.getUsername());
            mailMessage.setSubject("Новый комментарий");
            mailMessage.setText(
                    String.format(
                            "Уважаемый %s!" + '\n' +
                                    "К задаче: %s" + '\n' +
                                    "Автор: %s" + '\n' +
                                    "Добавили новый коментарий" + '\n' + '\n' + '\n' +
                                    "Приложение Task Manager",
                            tempFriend.getName(), task.getTitle(), authorTask.getName()
                    ));
            mailSender.send(mailMessage);
        }
    }
}
