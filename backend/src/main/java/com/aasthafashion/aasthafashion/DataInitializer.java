package com.aasthafashion.aasthafashion;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.util.Arrays;
import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(ProductRepository repository) {
        return args -> {
            List<String> standardSizes = Arrays.asList("XS", "S", "M", "L", "XL");

            repository.save(new Product(null, "Midnight Velvet Gown", "Luxurious evening gown", 4500.0, 
                Arrays.asList(
                    "https://images.unsplash.com/photo-1539008835657-9e8e9680fe0a?w=800&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1568252542512-9fe8fe9c87bb?w=800&auto=format&fit=crop&q=80"
                ), standardSizes, "Evening"));

            repository.save(new Product(null, "Urban Denim Jacket", "Distressed blue denim", 2200.0, 
                Arrays.asList(
                    "https://images.unsplash.com/photo-1520975954732-35dd22299614?w=800&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&auto=format&fit=crop&q=80"
                ), standardSizes, "Streetwear"));

            repository.save(new Product(null, "Floral Summer Dress", "Breathable cotton dress", 1800.0, 
                Arrays.asList(
                    "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&auto=format&fit=crop&q=80"
                ), standardSizes, "Casual"));

            repository.save(new Product(null, "Tailored Boss Blazer", "Sharp charcoal blazer", 3200.0, 
                Arrays.asList(
                    "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1548883354-7622d03aca27?w=800&auto=format&fit=crop&q=80"
                ), standardSizes, "Workwear"));
            
            repository.save(new Product(null, "Satin Slip Skirt", "Champagne satin midi", 1500.0, 
                Arrays.asList(
                    "https://images.unsplash.com/photo-1609505848912-b7c3b8b494b7?w=800&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&auto=format&fit=crop&q=80"
                ), standardSizes, "Casual"));

            repository.save(new Product(null, "Leather Trousers", "Sleek black faux leather", 2800.0, 
                Arrays.asList(
                    "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1551107643-406b3a01662c?w=800&auto=format&fit=crop&q=80"
                ), standardSizes, "Evening"));
        };
    }
}
