<?php

namespace FarmWork\Controllers;

use FarmWork\Helpers\FeedRequirementHelper;


class FeedRequirementController extends BaseController
{
    // main page
    public function index()
    {      
        //security
        session_regenerate_id();

        echo $this->view->render('Ration\feed_requirements\index.twig');            
    }

    /**
     * --------------------------------------------------
     * Gets table of feed requirements
     * ---------------------------------------------------
     */
    public function getFeedRequirementsInformation(){

        //security
        session_regenerate_id();

        // Takes raw data from the request
        $json = file_get_contents('php://input');
  
        // Converts it into a PHP object
        $data = json_decode($json);

        $adg = $data->adg;
        $start_weight = $data->start_weight;
        $end_weight = $data->end_weight;
          
    
        $helper = new FeedRequirementHelper();
        $items = $helper->getFeedRequirements($adg, $start_weight, $end_weight);
        
        //convert to json
        $items = json_encode($items);      
        echo $items;
    
    }
}