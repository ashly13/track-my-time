/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.ashwitha.web_service;

import org.springframework.data.mongodb.repository.MongoRepository;

/**
 *
 * @author WELCOME
 */

public interface ActivityRepository extends MongoRepository<Activity, String> {
}
