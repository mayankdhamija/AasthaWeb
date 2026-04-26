package com.aasthafashion.aasthafashion;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String name;
    private String description;
    private Double price;
    
    @ElementCollection
    private List<String> imageUrls;
    
    @ElementCollection
    private List<String> availableSizes;
    
    private String category;
}
