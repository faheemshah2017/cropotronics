jQuery(document).ready(function () {
    all_divs = ['growing_area','biomass','water_volume','feed','no_of_heads'];
    referance_var = $('#referance_var').val();
    change_type(referance_var);
    technique = $('#technique').val();
    change_technique(technique);

    $('#curr_biomass_input').val(5.64);
    $('#curr_fishtank_vol_input').val(400);
    $('#curr_fish_feed_input').val(90);
    $('#flow_rate_input').val(10);
    $('#mbt_growing_area_input').val(0.9472);
    $('#mbt_media_bed_dpt_input').val(20);
    $('#mbt_leafy_input').val(0);
    $('#mbt_fruity_input').val(7);
    $('#mbt_sump_input').val(400);
    $('#nft_pipe_len_input').val(11.7);
    $('#nft_pipe_dia_input').val(13);
    $('#nft_leafy_input').val(0);
    $('#nft_fruity_input').val(2);
    $('#volume_biofilter_input').val(120);
    $('#volume_mechanical_filter_input').val(120);
});


function change_type(e){
    clear_values();
    
    $('#calculations').attr('style','display:none');
    $('body').find('input').val('');
    all_divs.forEach(div => {
        if(div==e){
            $('#'+div+'_div').attr('style','display:none');
            $('#'+div+'_input_div').removeAttr('style','display:none');
        }
        else{
            $('#'+div+'_div').removeAttr('style','display:none');
            $('#'+div+'_input_div').attr('style','display:none');
        }
    });
}

function calculate_values(referance_value,id=''){
    $('#calculations').attr('style','display:block');
    referance_var = $('#referance_var').val();
    referance_value = parseFloat(referance_value);
    $("#gravel_type").val('common_gravel');

    if(referance_var=='growing_area'){
        growing_area_leafy_vegs = referance_value;
        growing_area_fruity_plants = referance_value;
        no_of_heads_leafy_vegs = round_number(growing_area_leafy_vegs*20);
        no_of_heads_fruity_plants = round_number(growing_area_fruity_plants*6);
        feed_leafy_vegs = round_number(growing_area_leafy_vegs*40);
        feed_fruity_plants = round_number(growing_area_fruity_plants*70);
        biomass_leafy_vegs = round_number(((feed_leafy_vegs*0.1)/1.5));
        biomass_fruity_plants = round_number(((feed_fruity_plants*0.1)/1.5));
        water_volume_leafy_vegs = round_number(((biomass_leafy_vegs/15)*1000));
        water_volume_fruity_plants = round_number(((biomass_fruity_plants/15)*1000));
    }
    else if(referance_var=='biomass'){
        biomass_leafy_vegs = referance_value;
        biomass_fruity_plants = referance_value;
        feed_leafy_vegs = round_number(((biomass_leafy_vegs*1000)*1.5/100));
        feed_fruity_plants = round_number(((biomass_fruity_plants*1000)*1.5/100));
        water_volume_leafy_vegs = round_number(((biomass_leafy_vegs/15)*1000));
        water_volume_fruity_plants = round_number(((biomass_fruity_plants/15)*1000));
        growing_area_leafy_vegs = round_number(feed_leafy_vegs/40);
        growing_area_fruity_plants = round_number(feed_fruity_plants/70);
        no_of_heads_leafy_vegs = round_number(growing_area_leafy_vegs*20);
        no_of_heads_fruity_plants = round_number(growing_area_fruity_plants*6);
    }
    else if(referance_var=='water_volume'){
        water_volume_leafy_vegs = referance_value;
        water_volume_fruity_plants = referance_value;
        biomass_leafy_vegs = round_number(((15/1000)*water_volume_leafy_vegs));
        biomass_fruity_plants = round_number(((15/1000)*water_volume_fruity_plants));
        feed_leafy_vegs = round_number(((biomass_leafy_vegs*1000)*1.5/100));
        feed_fruity_plants = round_number(((biomass_fruity_plants*1000)*1.5/100));
        growing_area_leafy_vegs = round_number(feed_leafy_vegs/40);
        growing_area_fruity_plants = round_number(feed_fruity_plants/70);
        no_of_heads_leafy_vegs = round_number(growing_area_leafy_vegs*20);
        no_of_heads_fruity_plants = round_number(growing_area_fruity_plants*6);
    }
    else{
        if(id=='no_of_leafy_plants_input'){
            no_of_heads_leafy_vegs = referance_value;
            growing_area_leafy_vegs = round_number(no_of_heads_leafy_vegs/20);
            feed_leafy_vegs = round_number(growing_area_leafy_vegs*40)
            biomass_leafy_vegs = round_number(((feed_leafy_vegs*0.1)/1.5));
            water_volume_leafy_vegs = round_number(((biomass_leafy_vegs/15)*1000));
        }
        else{
            no_of_heads_fruity_plants = referance_value;
            growing_area_fruity_plants = round_number(no_of_heads_fruity_plants/6);
            feed_fruity_plants = round_number(growing_area_fruity_plants*70)
            biomass_fruity_plants = round_number(((feed_fruity_plants*0.1)/1.5));
            water_volume_fruity_plants = round_number(((biomass_fruity_plants/15)*1000));
        }
    }

    calculate_other_parameters();
    calculate_bell_diameter();
    populate_values();
}

function round_number(number){
    return Math.round(number*1000)/1000;
}

function change_gravel_type(type){
    if(type=="volcanic_gravel"){
        gravel_leafy_vegs = round_number(((ammonia_leafy_vegs/0.57)/300));
        gravel_fruity_plants = round_number(((ammonia_fruity_plants/0.57)/300));
    }
    else{
        gravel_leafy_vegs = round_number(((ammonia_leafy_vegs/0.57)/150));
        gravel_fruity_plants = round_number(((ammonia_fruity_plants/0.57)/150));
    }
    populate_values();
}

function calculate_bell_diameter(){

    bed_volume_in_gallons_lv = media_bed_gravel_leafy_vegs*264.172;
    bed_volume_in_gallons_fp = media_bed_gravel_fruity_plants*264.172;

    if(bed_volume_in_gallons_lv>=30&&bed_volume_in_gallons_lv<120){
        stand_pipe_diameter_leafy_vegs = 0.5;
    }
    else if(bed_volume_in_gallons_lv>=120&&bed_volume_in_gallons_lv<180){
        stand_pipe_diameter_leafy_vegs = 1;
    }
    else if(bed_volume_in_gallons_lv>=180&&bed_volume_in_gallons_lv<240){
        stand_pipe_diameter_leafy_vegs = 1.5;
    }
    else if(bed_volume_in_gallons_lv>=240){
        stand_pipe_diameter_leafy_vegs = 2;
    }
    else{
        stand_pipe_diameter_leafy_vegs = 0.25;
    }
    if(bed_volume_in_gallons_fp>=30&&bed_volume_in_gallons_fp<120){
        stand_pipe_diameter_fruity_plants = 0.5;
    }
    else if(bed_volume_in_gallons_fp>=120&&bed_volume_in_gallons_fp<180){
        stand_pipe_diameter_fruity_plants = 1;
    }
    else if(bed_volume_in_gallons_fp>=180&&bed_volume_in_gallons_fp<240){
        stand_pipe_diameter_fruity_plants = 1.5;
    }
    else if(bed_volume_in_gallons_fp>=240){
        stand_pipe_diameter_fruity_plants = 2;
    }
    else{
        stand_pipe_diameter_fruity_plants = 0.25;
    }
}

function calculate_other_parameters(){
    ammonia_leafy_vegs = round_number(((feed_leafy_vegs*7.5)/200));
    ammonia_fruity_plants = round_number(((feed_fruity_plants*7.5)/200));
    gravel_leafy_vegs = round_number(((ammonia_leafy_vegs/0.57)/150));
    gravel_fruity_plants = round_number(((ammonia_fruity_plants/0.57)/150));
    media_bed_gravel_leafy_vegs = round_number(growing_area_leafy_vegs*0.254);
    media_bed_gravel_fruity_plants = round_number(growing_area_fruity_plants*0.254);
    sump_leafy_vegs = round_number(((media_bed_gravel_leafy_vegs*1000/2))*1.3);
    sump_fruity_plants = round_number(((media_bed_gravel_fruity_plants*1000)/2)*1.3);
    mb_total_water_volume_leafy_vegs = round_number(water_volume_leafy_vegs+((growing_area_leafy_vegs*0.2032)*1000/2)+sump_leafy_vegs);
    mb_total_water_volume_fruity_plants = round_number(water_volume_fruity_plants+((growing_area_leafy_vegs*0.2032)*1000/2)+sump_fruity_plants);
    
    mechanical_filter_vol = round_number(water_volume_leafy_vegs/6);
    bio_filter_vol = round_number(water_volume_leafy_vegs/6);
    
    dwc_water_volume = (growing_area_leafy_vegs*0.254)*1000;
    dwc_total_water_volume_leafy_vegs = round_number(water_volume_leafy_vegs+((growing_area_leafy_vegs*0.254)*1000)+mechanical_filter_vol+bio_filter_vol);
    //dwc_total_water_volume_fruity_plants = round_number(water_volume_fruity_plants+((growing_area_leafy_vegs*0.254)*1000)+mechanical_filter_vol_leafy_vegs);
}

function populate_values(){
    $('#biomass_leafy_vegs').val(biomass_leafy_vegs);
    $('#biomass_fruity_plants').val(biomass_fruity_plants);
    $('#feed_leafy_vegs').val(feed_leafy_vegs);
    $('#feed_fruity_plants').val(feed_fruity_plants);
    $('#growing_area_leafy_vegs').val(growing_area_leafy_vegs);
    $('#growing_area_fruity_plants').val(growing_area_fruity_plants);
    $('#no_of_heads_leafy_vegs').val(no_of_heads_leafy_vegs);
    $('#no_of_heads_fruity_plants').val(no_of_heads_fruity_plants);
    $('#ammonia_leafy_vegs').val(ammonia_leafy_vegs);
    $('#ammonia_fruity_plants').val(ammonia_fruity_plants);
    $('#gravel_leafy_vegs').val(gravel_leafy_vegs);
    $('#gravel_fruity_plants').val(gravel_fruity_plants);
    $('#sump_leafy_vegs').val(sump_leafy_vegs);
    $('#sump_fruity_plants').val(sump_fruity_plants)
    $('#water_volume_leafy_vegs').val(water_volume_leafy_vegs);
    $('#water_volume_fruity_plants').val(water_volume_fruity_plants);
    $('#mb_total_water_volume_leafy_vegs').val(mb_total_water_volume_leafy_vegs);
    $('#mb_total_water_volume_fruity_plants').val(mb_total_water_volume_fruity_plants);
    $('#dwc_total_water_volume_leafy_vegs').val(dwc_total_water_volume_leafy_vegs);
    //$('#dwc_total_water_volume_fruity_plants').val(dwc_total_water_volume_fruity_plants);
    $('#mb_flow_rate_leafy_vegs').val(round_number(mb_total_water_volume_leafy_vegs/120));
    $('#mb_flow_rate_fruity_plants').val(round_number(mb_total_water_volume_fruity_plants/120));
    $('#dwc_flow_rate_leafy_vegs').val(round_number(dwc_total_water_volume_leafy_vegs/120));
    //$('#dwc_flow_rate_fruity_plants').val(round_number(dwc_total_water_volume_fruity_plants/120));
    $('#media_bed_gravel_leafy_vegs').val(media_bed_gravel_leafy_vegs);
    $('#media_bed_gravel_fruity_plants').val(media_bed_gravel_fruity_plants);
    $('#stand_pipe_height_leafy_vegs').val(6);
    $('#stand_pipe_diameter_leafy_vegs').val(stand_pipe_diameter_leafy_vegs);
    $('#stand_pipe_height_fruity_plants').val(6);
    $('#stand_pipe_diameter_fruity_plants').val(stand_pipe_diameter_fruity_plants);
    $('#bell_height_leafy_vegs').val(7);
    $('#bell_diameter_leafy_vegs').val(stand_pipe_diameter_leafy_vegs*2);
    $('#bell_height_fruity_plants').val(7);
    $('#bell_diameter_fruity_plants').val(stand_pipe_diameter_fruity_plants*2);
    $('#dwc_water_volume').val(round_number(dwc_water_volume));
    nft_length = ((no_of_heads_leafy_vegs+1)/2)+((no_of_heads_leafy_vegs*2)/12);
    $('#nft_length_leafy_vegs').val(round_number(nft_length));
    $('#nft_diameter_leafy_vegs').val('4 inches');

    $('#mechanical_filter_vol').val(mechanical_filter_vol);
    $('#bio_filter_vol').val(bio_filter_vol);
    
    nft_water_volume = nft_length*2;
    $('#nft_water_volume').val(round_number(nft_water_volume));
    nft_total_water_volume = nft_water_volume+water_volume_leafy_vegs+mechanical_filter_vol+bio_filter_vol;
    $('#nft_total_water_volume').val(round_number(nft_total_water_volume));
    $('#nft_flow_rate_leafy_vegs').val(round_number(nft_total_water_volume/120));

    
}

function clear_values(){
    no_of_heads_leafy_vegs = '';
    no_of_heads_fruity_plants = '';
    feed_leafy_vegs = '';
    feed_fruity_plants = '';
    biomass_leafy_vegs = '';
    biomass_fruity_plants = '';
    water_volume_leafy_vegs = '';
    water_volume_fruity_plants = '';
    ammonia_leafy_vegs = '';
    ammonia_fruity_plants = '';
    gravel_leafy_vegs = '';
    gravel_fruity_plants = '';
    sump_leafy_vegs = '';
    sump_fruity_plants = '';
    mb_total_water_volume_leafy_vegs = '';
    mb_total_water_volume_fruity_plants = '';
    dwc_total_water_volume_leafy_vegs = '';
    dwc_total_water_volume_fruity_plants = '';
    growing_area_leafy_vegs = '';
    growing_area_fruity_plants = '';
}

function change_technique(technique){
    if(technique=="DWC_tech"){
        $('#stand_pipe_div').attr('style','display:none');
        $('#bell_div').attr('style','display:none');
        $('#mb_total_water_volume_div').attr('style','display:none');
        $('#mb_flow_rate_div').attr('style','display:none');
        $('#mb_total_water_volume_div').attr('style','display:none');
        $('#mb_flow_rate_div').attr('style','display:none');
        $('#sump_div').attr('style','display:none');
        $('#dwc_water_div').removeAttr('style','display:none');
        $('#media_bed_gravel_div').attr('style','display:none');
        $('#nft_pipe_div').attr('style','display:none');
        $('#dwc_flow_rate_div').removeAttr('style','display:none');
        $('#nft_flow_rate_div').attr('style','display:none');
        $('#nft_water_volume_div').attr('style','display:none');
        $('#nft_total_water_volume_div').attr('style','display:none');
        $('#mechanical_filter_div').removeAttr('style','display:none');
        $('#dwc_total_water_volume_div').removeAttr('style','display:none');
        $('#no_of_fruity_plants_input').attr('disabled','true');
        $('#bio_filter_vol_div').removeAttr('style','display:none');
        
    }
    else if(technique=="NFT_tech"){
        $('#stand_pipe_div').attr('style','display:none');
        $('#bell_div').attr('style','display:none');
        $('#mb_total_water_volume_div').attr('style','display:none');
        $('#mb_flow_rate_div').attr('style','display:none');
        $('#mb_total_water_volume_div').attr('style','display:none');
        $('#mb_flow_rate_div').attr('style','display:none');
        $('#sump_div').attr('style','display:none');
        $('#dwc_water_div').attr('style','display:none');
        $('#media_bed_gravel_div').attr('style','display:none');
        $('#nft_pipe_div').removeAttr('style','display:none');
        $('#dwc_flow_rate_div').attr('style','display:none');
        $('#nft_flow_rate_div').removeAttr('style','display:none');
        $('#nft_water_volume_div').removeAttr('style','display:none');
        $('#mb_total_water_volume_div').attr('style','display:none');
        $('#dwc_total_water_volume_div').attr('style','display:none');
        $('#mechanical_filter_div').removeAttr('style','display:none');
        $('#nft_total_water_volume_div').removeAttr('style','display:none');
        $('#no_of_fruity_plants_input').attr('disabled','true');
        $('#bio_filter_vol_div').removeAttr('style','display:none');
        
    }
    else{
        $('#stand_pipe_div').removeAttr('style','display:none');
        $('#bell_div').removeAttr('style','display:none');
        $('#mb_total_water_volume_div').removeAttr('style','display:none');
        $('#mb_flow_rate_div').removeAttr('style','display:none');
        $('#sump_div').removeAttr('style','display:none');
        $('#sump_div').removeAttr('style','display:none');
        $('#dwc_flow_rate_div').attr('style','display:none');
        $('#dwc_water_div').attr('style','display:none');
        $('#media_bed_gravel_div').removeAttr('style','display:none');
        $('#nft_pipe_div').attr('style','display:none');
        $('#nft_flow_rate_div').attr('style','display:none');

        $('#nft_water_volume_div').attr('style','display:none');
        $('#nft_total_water_volume_div').attr('style','display:none');
        $('#dwc_total_water_volume_div').attr('style','display:none');
        $('#nft_total_water_volume_div').attr('style','display:none');
        //$('#mechanical_filter_div').attr('style','display:none');
        $('#bio_filter_vol_div').attr('style','display:none');
        $('#no_of_fruity_plants_input').removeAttr('disabled','true');
    }
}

techniques = [];

function analyze(){
    $("#analysis_div_1").removeAttr('style','display:none');

    mbt_growing_area_input = parseFloat($("#mbt_growing_area_input").val());
    dwc_growing_area_input = parseFloat($("#dwc_growing_area_input").val());
    nft_pipe_len_input = parseFloat($("#nft_pipe_len_input").val());
    mbt_media_bed_dpt = parseFloat($("#mbt_media_bed_dpt_input").val());
    mbt_media_bed_dpt_in_meters = mbt_media_bed_dpt/100;
    total_leafy_plants = 0;
    total_fruity_plants = 0;
    total_feed_required_min = 0;
    total_feed_required_max = 0;
    total_water_volume = 0;
    total_growing_area = 0;

    
    total_water_volume += parseFloat($("#curr_fishtank_vol_input").val());
    console.log('total_water_volume:'+total_water_volume);

    if(techniques.includes('media_bed_tech')){

        // calculating media bed water volume
        media_bed_water_vol = (mbt_growing_area_input*mbt_media_bed_dpt_in_meters)*1000 // volume in leters
        media_bed_water_vol = media_bed_water_vol*.2; // water remain in media bed on siphon break (wet zone is 20%);

        // adding sump and media bed water volume in total
        total_water_volume += parseFloat($("#mbt_sump_input").val());
        total_water_volume += media_bed_water_vol;

        // Adding media bed plants in total
        total_leafy_plants += parseInt($("#mbt_leafy_input").val());
        total_fruity_plants += parseInt($("#mbt_fruity_input").val());

        // Adding media bed growing area in total
        total_growing_area += mbt_growing_area_input;

    }
    if(techniques.includes('DWC_tech')){
        total_water_volume += parseFloat($("#dwc_volume_input").val());

        // Adding DWC plants in total
        total_leafy_plants += parseInt($("#dwct_leafy_input").val());
        total_fruity_plants += parseInt($("#dwct_fruity_input").val());

        // Adding media bed growing area in total
        total_growing_area += dwc_growing_area_input;
    }
    if(techniques.includes('NFT_tech')){

        // calculating NFT water volume
        nft_pipe_radius = ((parseFloat($("#nft_pipe_dia_input").val()))/2)/100;
        nft_pipe_volume = 3.14*(nft_pipe_radius*nft_pipe_radius)*nft_pipe_len_input; // πr2h volume of cylendar in meter square 
        nft_pipe_volume = nft_pipe_volume*1000; // volume in ltrs

        // adding NFT water volume in total
        total_water_volume += nft_pipe_volume;
        
        // Adding NFT plants in total
        total_leafy_plants += parseInt($("#nft_leafy_input").val());
        total_fruity_plants += parseInt($("#nft_fruity_input").val());

        // Adding NFT growing area in total
        total_growing_area += (nft_pipe_len_input/4.5); // (20/4.44) as in one meter length of nft pipe we can grow 4.44 plants, while in 1 meter square of media bed we can grow 20 plants
    }

    // Adding filters water volume in total
    if(!techniques.includes('media_bed_tech')){
        total_water_volume += parseFloat($("#volume_biofilter_input").val());
        total_water_volume += parseFloat($("#volume_mechanical_filter_input").val());
    }
    else{
        let check_mec = $("input[name='is_mech']:checked");
        if(parseInt(check_mec.val())){
            total_water_volume += parseFloat($("#volume_mechanical_filter_input").val());
        }
        let check_bio = $("input[name='is_bio']:checked");
        if(parseInt(check_bio.val())){
            total_water_volume += parseFloat($("#volume_biofilter_input").val());
        }
    }

    no_of_leafy_plants_can = total_growing_area*20;
    no_of_fruity_plants_can = total_growing_area*6;

    // Start: media bed plant density
    mbt_fruity_plant_den_min = Math.round(mbt_growing_area_input*4);
    mbt_fruity_plant_den_max = Math.round(mbt_growing_area_input*8);
    mbt_fruity_input = parseInt($("#mbt_fruity_input").val());

    if(mbt_fruity_input<=mbt_fruity_plant_den_max){
        $("#mbt_fruity_plant_den_details").html(`&#9989; The current fruity plant density in media bed is <label style="color:green">good</label>, As you can grow `+mbt_fruity_plant_den_min+` to `+mbt_fruity_plant_den_max+` fruity plants.`);
    }
    else{
        $("#mbt_fruity_plant_den_details").html(`&#10060; The current fruity plant density in media bed is <label style="color:red">not good</label>, As you can grow `+mbt_fruity_plant_den_min+` to `+mbt_fruity_plant_den_max+` fruity plants.`);
    }

    mbt_leafy_plant_den_min = (mbt_growing_area_input*20)-(mbt_fruity_input*3.33);
    mbt_leafy_plant_den_max = (mbt_growing_area_input*25)-(mbt_fruity_input*3.33);
    mbt_leafy_input = parseInt($("#mbt_leafy_input").val());
    
    if(mbt_leafy_input<=Math.round(mbt_leafy_plant_den_max)){
        $("#mbt_leafy_plant_den_details").html(`&#9989; The current leafy plant density in media bed is <label style="color:green">good</label>, As you can grow upto `+Math.round(mbt_leafy_plant_den_max)+` leafy plants along with `+mbt_fruity_input+` fruity plants.`);
    }
    else{
        if(mbt_leafy_input == 0){
            $("#mbt_leafy_plant_den_details").html(`&#9989; The current leafy plant density in media bed is <label style="color:green">good</label>, As you can not grow more leafy plants along with `+mbt_fruity_input+` fruity plants.`);
        }
        else if(mbt_leafy_plant_den_max>0){
            $("#mbt_leafy_plant_den_details").html(`&#10060; The current leafy plant density in media bed is <label style="color:red">not good</label>, As you can only grow upto `+Math.round(mbt_leafy_plant_den_max)+` leafy plants along with `+mbt_fruity_input+` fruity plants.`);
        }
        else{
            $("#mbt_leafy_plant_den_details").html(`&#10060; The current leafy plant density in media bed is <label style="color:red">not good</label>, As you can not grow more leafy plants along with `+mbt_fruity_input+` fruity plants.`);
        }
    }
    
    // End: media bed plant density

    // Start: NFT plant density
    nft_plant_den_max = Math.round(nft_pipe_len_input*4.44);
    
    nft_leafy_input = parseInt($("#nft_leafy_input").val());

    if(nft_leafy_input<=nft_plant_den_max){
        $("#nft_leafy_plant_den_details").html(`&#9989; The current leafy plant density in NFT is <label style="color:green">good</label>, As you can grow `+nft_plant_den_max+` leafy plants in it (maintaining minimum 20cm gap between pots).`);
    }
    else{
        $("#nft_leafy_plant_den_details").html(`&#10060; The current leafy plant density in NFT is <label style="color:red">not good</label>, As you can't grow more than `+nft_plant_den_max+` leafy plants in it (maintaining minimum 25cm gap between pots).`);
    }

    nft_fruity_plant_den_max = nft_plant_den_max - nft_leafy_input;

    nft_fruity_input = parseInt($("#nft_fruity_input").val());
    
    if(nft_fruity_input<=nft_fruity_plant_den_max){
        $("#nft_fruity_plant_den_details").html(`&#9989; The current fruity plant density in NFT is <label style="color:green">good</label>, As you can grow upto `+nft_fruity_plant_den_max+` fruity plants along with `+nft_leafy_input+` leafy plants.`);
    }
    else{
        if(nft_fruity_input == 0){
            $("#nft_fruity_plant_den_details").html(`&#9989; The current fruity plant density in NFT is <label style="color:green">good</label>, As you can not grow more fruity plants along with `+nft_leafy_input+` leafy plants.`);
        }
        else if(nft_fruity_plant_den_max>0){
            $("#nft_fruity_plant_den_details").html(`&#10060; The current fruity plant density in NFT is <label style="color:red">not good</label>, As you can only grow upto `+nft_fruity_plant_den_max+` leafy plants along with `+nft_leafy_input+` leafy plants.`);
        }
        else{
            $("#nft_fruity_plant_den_details").html(`&#10060; The current fruity plant density in NFT is <label style="color:red">not good</label>, As you can not grow more fruity plants along with `+nft_leafy_input+` leafy plants.`);
        }
    }
    
    // End: NFT plant density

    // Start: DWC plant density

    dwc_leafy_plant_den_min = Math.round(dwc_growing_area_input*20);
    dwc_leafy_plant_den_max = Math.round(dwc_growing_area_input*25);
    dwc_leafy_input = parseInt($("#dwct_leafy_input").val());

    if(dwc_leafy_input<=dwc_leafy_plant_den_max){
        $("#dwc_leafy_plant_den_details").html(`&#9989; The current leafy plant density in DWC is <label style="color:green">good</label>, As you can grow `+dwc_leafy_plant_den_min+` to `+dwc_leafy_plant_den_max+` leafy plants in it.`);
    }
    else{
        $("#dwc_leafy_plant_den_details").html(`&#10060; The current leafy plant density in DWC is <label style="color:red">not good</label>, As you can't grow more than `+dwc_leafy_plant_den_max+` leafy plants in it.`);
    }

    dwc_fruity_plant_den_max = Math.round((dwc_leafy_plant_den_max-dwc_leafy_input)/3.33);

    dwc_fruity_input = parseInt($("#dwct_fruity_input").val());
    
    if(dwc_fruity_input<=dwc_fruity_plant_den_max){
        $("#dwc_fruity_plant_den_details").html(`&#9989; The current fruity plant density in DWC is <label style="color:green">good</label>, As you can grow upto `+dwc_fruity_plant_den_max+` fruity plants along with `+dwc_leafy_input+` leafy plants.`);
    }
    else{
        if(dwc_fruity_input == 0){
            $("#dwc_fruity_plant_den_details").html(`&#9989; The current fruity plant density in DWC is <label style="color:green">good</label>, As you can not grow more fruity plants along with `+dwc_leafy_input+` leafy plants.`);
        }
        else if(dwc_fruity_plant_den_max>0){
            $("#dwc_fruity_plant_den_details").html(`&#10060; The current fruity plant density in DWC is <label style="color:red">not good</label>, As you can only grow upto `+Math.round(dwc_fruity_plant_den_max)+` leafy plants along with `+dwc_leafy_input+` leafy plants.`);
        }
        else{
            $("#dwc_fruity_plant_den_details").html(`&#10060; The current fruity plant density in DWC is <label style="color:red">not good</label>, As you can not grow more fruity plants along with `+dwc_leafy_input+` leafy plants.`);
        }
    }
    
    // End: DWC plant density

    // Start: Fish stocking density
    curr_fishtank_vol_input = parseInt($("#curr_fishtank_vol_input").val());
    curr_biomass_input = parseFloat($("#curr_biomass_input").val());

    fish_tank_vol_req_min =  (curr_biomass_input/20)*1000;
    fish_tank_vol_req_max =  (curr_biomass_input/10)*1000;

    
    can_biomass_min = round_number(((10/1000)*curr_fishtank_vol_input));
    can_biomass_max = round_number(((20/1000)*curr_fishtank_vol_input));

    if(fish_tank_vol_req_min<=curr_fishtank_vol_input){
        $("#fish_stock_den_details").html(`&#9989; The current stocking density is <label style="color:green">good</label>, As you can stock `+can_biomass_min+` to `+can_biomass_max+`kg biomass in your fish tank of `+curr_fishtank_vol_input+`ltr.
        <br><br><label>&#128161; If the tank is smaller than 500 litres, reduce stocking density to one-half, or 1 kg per 100 litres, 
        though it is not recommended to grow fish for consumption in a tank smaller than 500 litres</label>`);
    }
    else{
        $("#fish_stock_den_details").html(`&#10060; The current leafy plant density in DWC is <label style="color:red">not good</label>, As you can't stock more than `+can_biomass_max+`kg biomass in your fish tank of `+curr_fishtank_vol_input+`ltr.`);
    }

    // End: Fish stocking density

    // Start: Feed Requirements
    curr_fish_feed_input = parseInt($("#curr_fish_feed_input").val());
    
    feed_req_by_biomass = round_number(((curr_biomass_input*1000)*1.5/100));

    if(feed_req_by_biomass<=curr_fish_feed_input){
        $("#fish_feed_details_biomass").html(`&#9989; The current feed rate is <label style="color:green">good</label>, As system has <b>`+curr_biomass_input+`Kg</b> of biomass, So feed requirement is <b>`+feed_req_by_biomass+`g/day</b>.`);
    }
    else{
        $("#fish_feed_details_biomass").html(`&#10060; The current feed rate is <label style="color:red">not good</label>, As system has <b>`+curr_biomass_input+`Kg</b> of biomass, So feed requirement is <b>`+feed_req_by_biomass+`g/day</b>.`);
    }

    feed_req_by_plant = (total_leafy_plants*1.6)+(total_fruity_plants*8.75);
    
    if(feed_req_by_plant<=curr_fish_feed_input){
        $("#fish_feed_details_plants").html(`&#9989; The current feed rate is <label style="color:green">good</label>, As system has <b>`+total_leafy_plants+`</b> leafy plants and <b>`+total_fruity_plants+`</b> fruity plants, So feed requirement is <b>`+feed_req_by_plant+`g/day</b>.`);
    }
    else{
        $("#fish_feed_details_plants").html(`&#10060; The current feed rate is <label style="color:red">not good</label>,As system has <b>`+total_leafy_plants+`</b> leafy plants and <b>`+total_fruity_plants+`</b> fruity plants, So feed requirement is <b>`+feed_req_by_plant+`g/day</b>.`);
    }

    // End: Feed Requirements

    // Start: Flow Rate
    
    flow_rate_input = parseInt($("#flow_rate_input").val());
    flow_rate_req = round_number(total_water_volume/120);
    
    flow_rate_range_min = flow_rate_req - flow_rate_req*.1;
    flow_rate_range_max = flow_rate_req + flow_rate_req*.1;

    if(flow_rate_range_min<=flow_rate_input&&flow_rate_input<=flow_rate_range_max){
        $("#flow_rate_details").html(`&#9989; The current flow rate is <label style="color:green">good</label>, As system has <b>`+Math.round(total_water_volume)+` Ltrs</b> of water, So needed flow rate is <b>`+Math.round(flow_rate_req)+` Ltr/min</b>.`);
    }
    else{
        $("#flow_rate_details").html(`&#10060; The current flow rate is <label style="color:red">not good</label>, As system has <b>`+Math.round(total_water_volume)+` Ltrs</b> of water, So needed flow rate is <b>`+Math.round(flow_rate_req)+` Ltr/min</b>.`);
    }

    // End: Flow Rate

    // Start: System Balance

    fish_req_for_plants = ((feed_req_by_plant/1.5)*100)/1000;

    // flow_rate_req = round_number(total_water_volume/120);
    
    fish_needed_range_min = fish_req_for_plants - fish_req_for_plants*.2;
    fish_needed_range_max = fish_req_for_plants + fish_req_for_plants*.2;

    if(fish_needed_range_min<=curr_biomass_input&&curr_biomass_input<=fish_needed_range_max){
        $("#system_balance_details").html(`&#9989; System is <label style="color:green">balanced</label>. As the fish biomass needed to grow `+total_leafy_plants+` leafy plants and `+total_fruity_plants+` fruity plants is `+Math.round(fish_req_for_plants)+` kg.`);
        $("#system_balance_image").html(`<img src="/images/balanced_system.PNG" data-toggle="tooltip">`);
    }
    else if(curr_biomass_input>fish_needed_range_max){
        $("#system_balance_details").html(`&#10060; System is <label style="color:red">unbalanced</label> with too few plants and therefore too much nitrate . As the fish biomass needed to grow `+total_leafy_plants+` leafy plants and `+total_fruity_plants+` fruity plants is `+Math.round(fish_req_for_plants)+` kg. But your current biomass is `+curr_biomass_input+` kg.`);
        $("#system_balance_image").html(`<img src="/images/more_fish.PNG" data-toggle="tooltip">`);
    }
    else{
        $("#system_balance_details").html(`&#10060; system is <label style="color:red">unbalanced</label> with too many plants. therefore insufficient nitrates . As the fish biomass needed to grow `+total_leafy_plants+` leafy plants and `+total_fruity_plants+` fruity plants is `+Math.round(fish_req_for_plants)+` kg.  But your current biomass is `+curr_biomass_input+` kg.`);
        $("#system_balance_image").html(`<img src="/images/more_plants.PNG" data-toggle="tooltip">`);
    }

    // End: System Balance

    // console.log("total growing area:"+total_growing_area);
    // console.log("total number of leafy plants can be grown:"+no_of_leafy_plants_can);
    // console.log("total number of fruity plants can be grown:"+no_of_fruity_plants_can);
    // console.log("total number of fruity plants can be grown in media bed:"+(mbt_growing_area_input*6));
    // console.log("total number of leafy plants can be grown in media bed:"+(mbt_growing_area_input*20));
    // console.log("total number of leafy plants can be grown in nft:"+(nft_pipe_len_input*4.44));

    
    $(".no_of_leafy_plants_can").html(Math.round(no_of_leafy_plants_can));
    $(".no_of_fruity_plants_can").html(Math.round(no_of_fruity_plants_can));
    
    // console.log("total leafy plants:"+total_leafy_plants);
    // console.log("total fruity plants:"+total_fruity_plants);

    total_growing_capacity = total_growing_area*20;
    total_growing_capacity_mbt = mbt_growing_area_input*20;

    /* 40g of feed needed per meter square for leafy plants while 70g for fruity plants.
    As we can grow 20-25 leafy plants in a meter square so (40/20)-(40/25)  (1.6-2g) 1.8g avarage of feed per plant. 
    while for fruity 4-8 plants/meter square so (70/4)-(70/8)  (8.75-17.5g) 11.6g avarage of feed/plant*/
    
    total_feed_required_min = (total_leafy_plants*1.6)+(total_fruity_plants*8.75);
    total_feed_required_max = (total_leafy_plants*2)+(total_fruity_plants*17.5);


    // console.log("total_feed_required_min:"+total_feed_required_min);
    // console.log("total_feed_required_max:"+total_feed_required_max);

    min_fish_need = total_feed_required_min/15;
    max_fish_need = total_feed_required_max/15;

    // console.log("fish need min:"+min_fish_need);
    // console.log("fish need max:"+max_fish_need);

    new_fish_tank_vol_req_min =  (min_fish_need/10)*1000;
    new_fish_tank_vol_req_max =  (min_fish_need/20)*1000;
    

    // console.log("new_fish_tank_vol_req_min:"+new_fish_tank_vol_req_min);
    // console.log("new_fish_tank_vol_req_max:"+new_fish_tank_vol_req_max);

    // console.log("curr_fish_tank_vol_req_min:"+curr_fish_tank_vol_req_min);
    // console.log("curr_fish_tank_vol_req_max:"+curr_fish_tank_vol_req_max);

    /*
    If the tank is smaller than 500 litres, reduce stocking density to one-half, or 1 kg per 100 litres, 
    though it is not recommended to grow fish for consumption in a tank smaller than 500 litres.
    */

    growing_area = $("#growing_area_input").val();
    fishtank_vol = $("#curr_fishtank_vol_input").val();
    biomass = $("#curr_biomass_input").val();
    leafy_plants = $("#mbt_leafy_input").val();
    fruity_plants = $("#mbt_fruity_input").val();

    $(".growing_area_label").html(growing_area);
    $(".cur_biomass_val").html(biomass);
    
    feed_req_leafy_vegs = round_number(growing_area*40);
    feed_req_fruity_plants = round_number(growing_area*70);
    biomass_req_leafy_vegs = round_number(((feed_req_leafy_vegs*0.1)/1.5));
    biomass_req_fruity_plants = round_number(((feed_req_fruity_plants*0.1)/1.5));
    water_volume_leafy_vegs = round_number(((biomass_req_leafy_vegs/15)*1000));
    water_volume_fruity_plants = round_number(((biomass_req_fruity_plants/15)*1000));

    $(".biomass_required_leafy").html(biomass_req_leafy_vegs);
    $(".biomass_required_fruity").html(biomass_req_fruity_plants);

    $(".feed_required_leafy").html(feed_req_leafy_vegs);
    $(".feed_required_fruity").html(feed_req_fruity_plants);
    
    $(".water_required_leafy").html(water_volume_leafy_vegs);
    $(".water_required_fruity").html(water_volume_fruity_plants);

    growing_capicity = growing_area*20;
    growing_capicity = growing_capicity - leafy_plants - fruity_plants*3.33;
    more_fruity = growing_capicity/3.33;

    if(growing_capicity<0){
        $('.can_grow').html('You have planted more plants than your systems growing capacity.');
        $('.can_grow').attr('style','color:red');
    }
    else{
        $('.can_grow').html(' You can grow <b><label class="more_leafy"></label></b> more leafy plants or <b><label class="more_fruity"></label></b> more fruity plants.');
        $('.can_grow').attr('style','color:green');
    }

    $(".more_leafy").html(round_number(growing_capicity));
    $(".more_fruity").html(round_number(more_fruity));
    
    biomass_leafy_defference = biomass - biomass_req_leafy_vegs;
    per_BLD = (biomass_leafy_defference/biomass_req_leafy_vegs)*100;

    biomass_fruity_defference = biomass - biomass_req_fruity_plants;
    per_BFD = (biomass_fruity_defference/biomass_req_fruity_plants)*100;

    water_leafy_defference = fishtank_vol - water_volume_leafy_vegs;
    per_WLD = (water_leafy_defference/water_volume_leafy_vegs)*100;

    water_fruity_defference = fishtank_vol - water_volume_fruity_plants;
    per_WFD = (water_fruity_defference/water_volume_fruity_plants)*100;
    
    if(Math.abs(per_BLD) < 10){
        $(".biomass_status_leafy").html('enough');
        $('.biomass_status_leafy').attr('style','color:green');
    }
    else if(10 < Math.abs(per_BLD) && Math.abs(per_BLD) < 20){
        $(".biomass_status_leafy").html('nearly enough');
        $('.biomass_status_leafy').attr('style','color:orange');
    }
    else if(20 < per_BLD){
        $(".biomass_status_leafy").html('more than enough');
        $('.biomass_status_leafy').attr('style','color:orange');
    }
    else{
        $(".biomass_status_leafy").html('not enough');
        $('.biomass_status_leafy').attr('style','color:red');
    }

    if(Math.abs(per_BFD) < 10){
        $(".biomass_status_fruity").html('enough');
        $('.biomass_status_fruity').attr('style','color:green');
    }
    else if(10 < Math.abs(per_BFD) && Math.abs(per_BFD) < 20){
        $(".biomass_status_fruity").html('nearly enough');
        $('.biomass_status_fruity').attr('style','color:orange');
    }
    else if(20 < per_BFD){
        $(".biomass_status_fruity").html('more than enough');
        $('.biomass_status_fruity').attr('style','color:orange');
    }
    else{
        $(".biomass_status_fruity").html('not enough');
        $('.biomass_status_fruity').attr('style','color:red');
    }

    if(Math.abs(per_WLD) < 10){
        $(".water_status_leafy").html('enough');
        $('.water_status_leafy').attr('style','color:green');
    }
    else if(10 < Math.abs(per_WLD) && Math.abs(per_WLD) < 20){
        $(".water_status_leafy").html('nearly enough');
        $('.water_status_leafy').attr('style','color:orange');
    }
    else if(20 < per_WLD){
        $(".water_status_leafy").html('more than enough');
        $('.water_status_leafy').attr('style','color:orange');
    }
    else{
        $(".water_status_leafy").html('not enough');
        $('.water_status_leafy').attr('style','color:red');
    }

    if(Math.abs(per_WFD) < 10){
        $(".water_status_fruity").html('enough');
        $('.water_status_fruity').attr('style','color:green');
    }
    else if(10 < Math.abs(per_WFD) && Math.abs(per_WFD) < 20){
        $(".water_status_fruity").html('nearly enough');
        $('.water_status_fruity').attr('style','color:orange');
    }
    else if(20 < per_WFD){
        $(".water_status_fruity").html('more than enough');
        $('.water_status_fruity').attr('style','color:orange');
    }
    else{
        $(".water_status_fruity").html('not enough');
        $('.water_status_fruity').attr('style','color:red');
    }
    
}

function technique_selected(){
    techniques = $('#technique').val();
    if(techniques.includes('media_bed_tech')){
        $('#media_bed_plants').removeAttr('style','display:none');
        $('#ask_for_bio_filter').removeAttr('style','display:none');
        $('#ask_for_mech_filter').removeAttr('style','display:none');
        $('#mbt_plant_den_ana').removeAttr('style','display:none');
        
    }
    else{
        $('#media_bed_plants').attr('style','display:none');
        $('#ask_for_bio_filter').attr('style','display:none');
        $('#ask_for_mech_filter').attr('style','display:none');
        $('#mechanical_filter_div').removeAttr('style','display:none');
        $('#bio_filter_div').removeAttr('style','display:none');
        $('#mbt_plant_den_ana').attr('style','display:none');
    }
    if(techniques.includes('DWC_tech')){
        $('#dwc_plants').removeAttr('style','display:none');
        $('#dwc_plant_den_ana').removeAttr('style','display:none');
    }
    else{
        $('#dwc_plants').attr('style','display:none');
        $('#dwc_plant_den_ana').attr('style','display:none');
    }
    if(techniques.includes('NFT_tech')){
        $('#nft_plants').removeAttr('style','display:none');
        $('#nft_plant_den_ana').removeAttr('style','display:none');
    }
    else{
        $('#nft_plants').attr('style','display:none');
        $('#nft_plant_den_ana').attr('style','display:none');
    }
    $("#is_mech_no").attr('value','0');
    $("#is_mech_yes").attr('value','1');
    $("#is_bio_no").attr('value','0');
    $("#is_bio_yes").attr('value','1');
}


function mech_change(){
    var radioValue = $("input[name='is_mech']:checked");
    if(!parseInt(radioValue.val())){
        $('#mechanical_filter_div').attr('style','display:none');
    }
    else{
        $('#mechanical_filter_div').removeAttr('style','display:none');
    }
}

function bio_change(){
    var radioValue = $("input[name='is_bio']:checked");
    if(!parseInt(radioValue.val())){
        $('#bio_filter_div').attr('style','display:none');
    }
    else{
        $('#bio_filter_div').removeAttr('style','display:none');
    }
}


/* Wizerd */

//== Class definition
var WizardDemo = function () {
    //== Base elements
    var wizardEl = $('#m_wizard');
    var formEl = $('#m_form');
    var validator;
    var wizard;
    
    //== Private functions
    var initWizard = function () {
        //== Initialize form wizard
        wizard = new mWizard('m_wizard', {
            startStep: 1
        });

        //== Validation before going to next page
        wizard.on('beforeNext', function(wizardObj) {
            if (validator.form() !== true) {
                wizardObj.stop();  // don't go to the next step
            }
        })

        //== Change event
        wizard.on('change', function(wizard) {
            mUtil.scrollTop();            
        });

        //== Change event
        wizard.on('change', function(wizard) {
            if (wizard.getStep() === 3) {
                analyze()
            }     
            if (wizard.getStep() === 2) {
                technique_selected()
            }      
        });
    }

    var initValidation = function() {
        validator = formEl.validate({
            //== Validate only visible fields
            ignore: ":hidden",
    
            //== Validation rules
            rules: {
                mbt_growing_area_input: {
                    required: true,
                    number: true
                },
                curr_biomass_input:{
                    required: true,
                    number: true
                },
                curr_fishtank_vol_input:{
                    required: true,
                    number: true
                },
                curr_fish_feed_input:{
                    required: true,
                    number: true
                },
                mbt_leafy_input:{
                    required: true,
                    number: true
                },
                mbt_fruity_input:{
                    required: true,
                    number: true
                },
                nft_leafy_input:{
                    required: true,
                    number: true
                },
                nft_fruity_input:{
                    required: true,
                    number: true
                },
                dwct_leafy_input:{
                    required: true,
                    number: true
                },
                dwct_fruity_input:{
                    required: true,
                    number: true
                },
                nft_pipe_len_input:{
                    required: true,
                    number: true
                },
                nft_pipe_dia_input:{
                    required: true,
                    number: true
                },
                dwc_volume_input:{
                    required: true,
                    number: true
                },
                dwc_growing_area_input:{
                    required: true,
                    number: true
                },
                mbt_media_bed_dpt_input:{
                    required: true,
                    number: true
                },
                volume_biofilter_input:{
                    required: true,
                    number: true
                },
                volume_mechanical_filter_input:{
                    required: true,
                    number: true
                },
                mbt_sump_input:{
                    required: true,
                    number: true
                },
                flow_rate_input:{
                    required: true,
                    number: true
                }
            },
    
            //== Validation messages
            messages: {
                'account_communication[]': {
                    required: 'You must select at least one communication option'
                },
                accept: {
                    required: "You must accept the Terms and Conditions agreement!"
                } 
            },
            
            //== Display error  
            invalidHandler: function(event, validator) {     
                mUtil.scrollTop();
    
                swal({
                    "title": "", 
                    "text": "There are some errors in your submission. Please correct them.", 
                    "type": "error",
                    "confirmButtonClass": "btn btn-secondary m-btn m-btn--wide"
                });
            },
    
            //== Submit valid form
            submitHandler: function (form) {
                
            }
        });   
    }

    var initSubmit = function() {
        var btn = formEl.find('[data-wizard-action="submit"]');

        btn.on('click', function(e) {
            e.preventDefault();

            if (validator.form()) {

                mApp.progress(btn);

                swal({
                    "title": "", 
                    "text": "Thanks for using Farm Analyzer!", 
                    "type": "success",
                    "confirmButtonClass": "btn btn-secondary m-btn m-btn--wide"
                });
            }
        });
    }

    return {
        // public functions
        init: function() {
            wizardEl = $('#m_wizard');
            formEl = $('#m_form');

            initWizard(); 
            initValidation();
            initSubmit();
        }
    };
}();