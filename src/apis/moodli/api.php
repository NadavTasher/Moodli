<?php

/**
 * Copyright (c) 2020 Nadav Tasher
 * https://github.com/NadavTasher/Moodli/
 **/

include_once __DIR__ . DIRECTORY_SEPARATOR . ".." . DIRECTORY_SEPARATOR . "base" . DIRECTORY_SEPARATOR . "api.php";
include_once __DIR__ . DIRECTORY_SEPARATOR . ".." . DIRECTORY_SEPARATOR . "authenticate" . DIRECTORY_SEPARATOR . "api.php";

class Moodli
{

    private const API = "moodli";

    private const COLUMN_MAP = "map";

    private const MOOD_MINIMUM = 0;
    private const MOOD_MAXIMUM = 2;

    public static function init()
    {
        return API::handle(self::API, function ($action, $parameters) {
            // Authenticate user
            $user = Authenticate::init();
            // Check authentication result
            if ($user !== null) {
                // Load database
                $database = new Database(self::API);
                // Make sure the map column is set
                $database->create_column("map");
                // Check if user exists in app database
                if (!$database->has_row($user)) {
                    $database->create_row($user);
                }
                // Handle action
                if ($action === "prompt") {
                    // Fetch map
                    $map = self::get_map($user, $database);
                    // Get date parts
                    $year = date("Y");
                    $day = date("z");
                    // Return result
                    return [!isset($map->$year->$day), null];
                } else if ($action === "report") {
                    // Check for parameter
                    if (isset($parameters->mood)) {
                        // Make sure it's an int
                        if (is_integer($parameters->mood)) {
                            // Store mood
                            $mood = $parameters->mood;
                            // Check range
                            if ($mood >= self::MOOD_MINIMUM && $mood <= self::MOOD_MAXIMUM) {
                                // Fetch map
                                $map = self::get_map($user, $database);
                                // Get date parts
                                $year = date("Y");
                                $day = date("z");
                                // Make sure the day hasn't been reported yet
                                if (!isset($map->$year->$day)) {
                                    $map->$year->$day = $mood;
                                    // Update map
                                    self::set_map($map, $user, $database);
                                    // Return result
                                    return [true, null];
                                }
                                // Return result
                                return [false, null];
                            }
                            return [false, "Mood is not in range"];
                        }
                        return [false, "Mood must be numeric"];
                    }
                    return [false, "Mood parameter is missing"];
                } else if ($action === "statistics") {
                    return [true, self::get_map($user, $database)];
                }
                // Fallback result
                return [false, "Unknown action"];
            }
            // Fallback result
            return [false, "Authentication failed"];
        }, true);
    }

    /**
     * Fetches a mood map.
     * @param string $user User ID
     * @param Database $database Database
     * @return stdClass Mood Map
     */
    private static function get_map($user, $database)
    {
        // Make sure the map exists
        if (!$database->isset($user, self::COLUMN_MAP)) {
            // Create the map
            $database->set($user, self::COLUMN_MAP, json_encode(new stdClass()));
        }
        // Fetch map
        return json_decode($database->get($user, self::COLUMN_MAP));
    }

    /**
     * Updates a mood map.
     * @param stdClass $map Mood map
     * @param string $user User ID
     * @param Database $database Database
     */
    private static function set_map($map, $user, $database)
    {
        $database->set($user, self::COLUMN_MAP, json_encode($map));
    }
}