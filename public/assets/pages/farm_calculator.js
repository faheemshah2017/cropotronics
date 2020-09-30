jQuery(document).ready(function () {
    all_divs = ['growing_area','biomass','water_volume','feed','no_of_heads'];
    referance_var = $('#referance_var').val();
    change_type(referance_var);
    technique = $('#technique').val();
    change_technique(technique);
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
        $('#mechanical_filter_div').attr('style','display:none');
        $('#bio_filter_vol_div').attr('style','display:none');
        $('#no_of_fruity_plants_input').removeAttr('disabled','true');
    }
}