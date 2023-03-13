<?php

namespace FarmWork\Controllers;

use FarmWork\Helpers\RationCalculatorHelper;
use FarmWork\Libraries\CSRFToken;


class RationCalculatorController extends BaseController
{
    // main page
    public function index()
    {
       session_regenerate_id();

       echo $this->view->render('Ration\rationcalculator\index.twig',
            [ 'csrf' => CSRFToken::getToken()]
        );    
    }

    /**
     * ------------------------------------------------
     * gets list of all available feeds 
     * ------------------------------------------------
     */
    public function getFeeds(){


          // Takes raw data from the request
          $json = file_get_contents('php://input');

          // Converts it into a PHP object
          $data = json_decode($json);
  
          //get results
          $helper = new RationCalculatorHelper();
          $items = $helper->getFeeds();
         
          //convert to json
          $items = json_encode($items);      
          echo $items;
    }

    /**
     * ----------------------------------------------------
     * set feed as default
     * ----------------------------------------------------
     */
    public function setFeedAsDefault(){

        //security
        session_regenerate_id();

        // Takes raw data from the request
        $json = file_get_contents('php://input');

        // Converts it into a PHP object
        $data = json_decode($json);
        
        //check csrf key
        if(CSRFToken::isValid($data->csrf)){
            //get results
            $helper = new RationCalculatorHelper();
            $items = $helper->setFeedAsDefault($data->id, $data->is_default);
         
            //convert to json
            $items = json_encode($items);      
            echo $items;
        }
    }

    /**
     * ------------------------------------------------------------
     * Feed requirements page
     * ----------------------------------------------------------
    */
    public function FeedRequirements($adg = 3, $start_weight = 100, $end_weight = 1600){

        //security
        session_regenerate_id();

        //get results
        $helper = new RationCalculatorHelper();
        $items = $helper->getFeedRequirements($adg = 3, $start_weight = 100, $end_weight = 1600);    

        echo $this->view->render('Ration\rationcalculator\feedrequirements.twig',
            [ 'requirements' => $items ]
        );            
    }

     /**
     * ---------------------------------------------------------
     * gets requirements for animals based on weight and other things
     * ---------------------------------------------------------
     */
    public function getFeedRequirements($adg = 3, $start_weight = 100, $end_weight = 1600){

        //security
        session_regenerate_id();

        // Takes raw data from the request
        $json = file_get_contents('php://input');
  
        // Converts it into a PHP object
        $data = json_decode($json);

        if(isset($data->adg)) $adg = $data->adg;
        if(isset($data->start_weight)) $start_weight = $data->start_weight;
        if(isset($data->end_weight)) $end_weight = $data->end_weight;
          
        //check csrf key
        if(CSRFToken::isValid($data->csrf)){
            //get results
            $helper = new RationCalculatorHelper();
            $items = $helper->getFeedRequirements($adg, $start_weight, $end_weight);
           
            //convert to json
            $items = json_encode($items);      
            echo $items;
        }
    }
    /**
     * --------------------------------------------------------------
     * Get List of Available Requirements ADG
     * --------------------------------------------------------------
     */
    public function FeedRequirementsAdg(){
         //security
         session_regenerate_id();
         
        //get results
        $helper = new RationCalculatorHelper();
        $items = $helper->FeedRequirementsAdg();
    
        //convert to json
        $items = json_encode($items);      
        echo $items;
    }
}