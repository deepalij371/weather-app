package com.example.weatherapp.config;
import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.*;
import org.springframework.kafka.config.TopicBuilder;
@Configuration public class KafkaTopicConfig {
    @Bean public NewTopic t1() { return TopicBuilder.name("weather-search-events").build(); }
    @Bean public NewTopic t2() { return TopicBuilder.name("weather-alerts").build(); }
    @Bean public NewTopic t3() { return TopicBuilder.name("user-notifications").build(); }
    @Bean public NewTopic t4() { return TopicBuilder.name("analytics-events").build(); }
}
