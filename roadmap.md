
Planned: Version 0.0.10
    Making this use fnl.
        Seems best at this stage.

    Transformer
        Compiler
        Codec
    Encoding_Type?
    Encoding
        - Language short name
        - Version short string
        - (Further encoding options?)

        // eg 'js', '2022'.    could give js versions by dates.
        //    'js', '2018' may be more realistic for browser support.

    Input encoding
    Output encoding

2022 0.0.12 onwards:

Improvements that will help with the jsgui control MVC system.
The control is essentially the controller, however, could add a .controller property.
Do see the advantage in adding a .model property, and .view property.
Plan on doing both with mixins.
Maybe on all controls? Maybe not.
Maybe on MVC_Control.

[Late 2023
  Data_Object is at the core of the currently developing implementation of MVC (Control has: Data_Model, View_Model)
  Not yet using Data_Value properly.
  May make sense to use it as a single value within a Data_Model.
  // maybe ._ will be the value????
  // or .v ???
  
  // Defining the format of / for the Data_Value.

  // Maybe remake both of them in improved ways?
  //   Would need to define what their APIs are and make improved versions (first?)

  // Maybe some API changes...?
  //   .get being a different way to go about things than fields.

  //   .get(key, format) could help though.
  //   .get(key, other_function_to_call_before_returning_value)










]

MVC_Control may be the best platform on which to create controls in the future.
  A more clearly defined and documented API. ???
    Better document existing API???
  The API will be clearer within the code itself.
    Will be clearer that a calendar interacts with dates, yet also allows interaction with events that take place on specified dates.
      eg Date and Dated_Event class?
        May have a kind of list of the data types that it interacts with
          Date
          Calendar_Event
            start_date
            end_date
            location (string? any?)
            participants
              (their email addresses? phone numbers? could get quite in depth)
              user contacts from other apps...?

  .view has been described a lot. how it gets presented in different circumstances

  .controller ??? possibly some settings to do with how the control operates.
    logging perhaps
    logging to server perhaps
    being able to inject other function calls in various places
      so a subclass able to access the superclass's controller may have a useful means to upgrade...?
        though maybe those would be view functions or hooks anyway.

  Don't see much need in .controller.
    Should I try to find one? Or make the .model and .view which seem much more important?
      The control essentially is the controller.
        Maybe a controller would be of use for post-construct? But that still seems very much like view.
  Much of the existing logic falls within 'view' category.
  Model is not that much of a challenge as we can use a reference to an object. Want to now better define the type of Model data.

  



  







