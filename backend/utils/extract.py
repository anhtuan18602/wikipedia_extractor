import requests
from datetime import datetime, timedelta
import wikitextparser as wtp
import wikipediaapi
import re
from groq import Groq
from IPython.display import Image, display
from bs4 import BeautifulSoup
import re
from nltk.corpus import stopwords
import string
from nltk.stem import WordNetLemmatizer
from scipy.spatial.distance import cdist
import json
import Levenshtein
import praw
import numpy as np
from datetime import datetime
from dotenv import load_dotenv
import os

# Load environment variables from .env file
"""
load_dotenv()
reddit = praw.Reddit(
    client_id= os.getenv('REDDIT_CLIENT_ID'),            
    client_secret= os.getenv('REDDIT_CLIENT_SECRET'),   
    user_agent= os.getenv('REDDIT_USER_AGENT'),
    username= os.getenv('REDDIT_USERNAME'),
    password= os.getenv('REDDIT_PASSWORD'),
)
"""

def clean_text(text):
    if not text:
        return text
    text = re.sub(r"<!--.*?-->", "", text)  # Remove comments
    text = re.sub(r"\{\{.*?\|", "", text)   # Remove templates like {{...|
    text = re.sub(r"\}\}", "", text)        # Remove closing braces }}
    text = re.sub(r"\[\[(.*?)\]\]", r"\1", text)  # Remove links, keep text
    text = re.sub(r'<.*?>', '', text)
    return text.strip()


def is_int(x):
    try:
        int(x)
        return True
    except ValueError:
        return False

def search_wikipedia(query):
    url = "https://en.wikipedia.org/w/api.php"
    params = {
        "action": "query",
        "list": "search",
        "srsearch": query,
        "format": "json",
        "srlimit": 5  
    }
    
    response = requests.get(url, params=params)
    data = response.json()
    
    return data['query']['search'] if 'query' in data else []

def get_image_url(image_title):
    url = 'https://en.wikipedia.org/w/api.php'
    params = {
        'action': 'query',
        'format': 'json',
        'titles': image_title,  
        'prop': 'imageinfo',  
        'iiprop': 'url|description'  
    }
    response = requests.get(url, params=params)
    
    if response.status_code == 200:
        data = response.json()
        pages = data['query']['pages']
        for page_id in pages:
            if 'imageinfo' in pages[page_id]:
                image_info = pages[page_id]['imageinfo'][0]
                
                image_url = image_info.get('url', 'No URL found')
                return image_url
    return None        

def get_image_urls(image_titles):
    """
    Given a list of image titles, return a dictionary of image URLs with titles as keys.
    """
    url = 'https://en.wikipedia.org/w/api.php'
    
    
    titles = '|'.join(image_titles)
    
    params = {
        'action': 'query',
        'format': 'json',
        'titles': titles,  
        'prop': 'imageinfo',  
        'iiprop': 'url|description'  
    }
    
    response = requests.get(url, params=params)
    
    if response.status_code == 200:
        data = response.json()
        pages = data['query']['pages']
        image_list = []
        
        for page_id, page_info in pages.items():
            if 'imageinfo' in page_info:
                image_info = page_info['imageinfo'][0]
                image_url = image_info.get('url', None)
                if image_url:
                    image_title = page_info['title']
                    img = {"url": image_url, "title":image_title,"caption": image_title[5:-4]}
                    image_list.append(img)
                
        return image_list
    return None

    
def get_wikipedia_images(pageid, title):
    url = "https://en.wikipedia.org/w/api.php"
    if pageid != None:
        params = {
            "action": "query",
            "pageids": pageid,
            "prop": "images",
            "format": "json"
        }
    else:
        params = {
        "action": "query",
        "titles": title,
        "prop": "images",
        "format": "json"
    }
    
    response = requests.get(url, params=params)
    
    if response.status_code == 200:
        data = response.json()
        
        
        images = data['query']['pages']
        image_titles = []
        
        for page_id in images:
            if 'images' in images[page_id]:
                for image in images[page_id]['images']:
                    image_titles.append(image['title'])
        image_list = get_image_urls(image_titles)
                
        return image_list
    else:
        return None
        



def get_pageviews(page_title, year):
    base_url = "https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article"
    project = "en.wikipedia"
    access = "all-access"
    agents = "all-agents"
    granularity = "monthly"
    
    
    start_date = f"{year}0101"  
    end_date = f"{year}1231"    
    
    
    url = f"{base_url}/{project}/{access}/{agents}/{page_title}/{granularity}/{start_date}/{end_date}"
    print(url)
    
    headers = {
        "User-Agent": "PythonNotebook/1.0 (your_email@example.com)"  
    }
    
    
    response = requests.get(url, headers=headers)
    
    if response.status_code != 200:
        print(f"Error fetching data: {response.status_code}")
        return None
    
    data = response.json()
    
    
    total_views = 0
    for item in data.get("items", []):
        total_views += item["views"]
    
    return total_views

def get_page(title):
    user_agent = "MyApp/1.0 (myemail@example.com)"  

    
    wiki = wikipediaapi.Wikipedia(language='en', user_agent=user_agent)
    
    
    page = wiki.page(title)
    
    if page.exists():
        return page
    else:
        return None

def extract_image_filename(image_title):
    
    pattern = r"([^\<]+)(?=\<|$)"
    
    match = re.match(pattern, image_title)
    
    if match:
        return match.group(1).strip()  
    return None
def get_date_format(date_string):
    
    date_object = datetime.strptime(date_string, "%Y.%m.%d")

    
    formatted_date = date_object.strftime("%d %B %Y")
    return formatted_date


def get_infobox(title, alt_image, display=False):
    url = f"https://en.wikipedia.org/w/api.php?action=query&titles={title}&prop=revisions&rvslots=*&rvprop=content&formatversion=2&format=json"
    response = requests.get(url)
    data = response.json()
    excluded = ["predecessor", "successor", "term"]
    
    page_content = data['query']['pages'][0]['revisions'][0]['slots']['main']['content']
    parsed = wtp.parse(page_content)
    i = 0
    nof_templates = len(parsed.templates)
    infobox = None
    while i < nof_templates:
        infobox = parsed.templates[i]
        if "Infobox" in infobox.name:
            break
        else:
            i+=1
    final_dict = {}
    if infobox != None:
        info_dict = {arg.name.strip(): arg.value.strip() for arg in infobox.arguments}
        
        ### --- Image processing --- ###
        if "image" in info_dict:
            img_title = extract_image_filename(info_dict["image"])
            if img_title:
                image_url = get_image_url("File:"+ img_title)
            
            caption = clean_text(info_dict["caption"]) if "caption" in info_dict else ""
            image = {"title":info_dict["image"], "url":image_url, "caption":caption}
            final_dict["image"] = image
            
                
        else:
            final_dict["image"] = alt_image
            
        ### --- Signature --- ###
        if "signature" in info_dict:
            img_title = extract_image_filename(info_dict["signature"])
            if img_title:
                image_url = get_image_url("File:"+ img_title)
            
            caption = clean_text(info_dict["caption"]) if "caption" in info_dict else ""
            image = {"title":info_dict["signature"], "url":image_url, "caption":caption}
            final_dict["signature"] = image
            
        ### --- Birthdate --- ###
        if "birth_date" in info_dict:
            data = clean_text(info_dict["birth_date"]).split("|")
            birth_date = []
            for x in data:
                if is_int(x):
                    birth_date.append(x)
            birthdate_str = ".".join(birth_date)
            final_dict["birth_date"] = get_date_format(birthdate_str)
            
        
        ### --- Deathdate --- ###
        if "death_date" in info_dict:
            data = clean_text(info_dict["death_date"]).split("|")
            death_date = []
            for x in data:
                if is_int(x):
                    death_date.append(x)
            deathdate_str = ".".join(death_date[0:3])
            final_dict["death_date"] = get_date_format(deathdate_str)

        ### --- Name --- ###
        if "name" in info_dict:
            final_dict["Name"] = clean_text(info_dict["name"])
        else:
            final_dict["Name"] = title.replace("_"," ")
        other_info = list(info_dict.keys() -set(["birth_date","name", "death_date","image","signature"]) - set(["module","alt","caption", 'notableworks','works']))
        for info in other_info:
            if not any(char.isdigit() for char in info):
                if not any(ex in info for ex in excluded):
                    info_str = clean_text(info_dict[info])
                    if len(info_str) < 50:
                    #print(f"{info}: {info_str}")
                        final_dict[info.replace("_"," ").title()] = info_str.replace("|",", ")
    
    if display == True:
        print(image)
        print(caption)
        print(f"Birth Date: {birthdate_str}")
        print(f"Death Date: {deathdate_str}")
        for info in other_info:
            print(f"{info.replace('_',' ')}: {final_dict[info].replace('|',',')}")
    return final_dict

def get_type(query):
    client = Groq(
        api_key="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",
    )
    
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": f"""
                Classify the following query as one of the following categories: person, event, or subject. 
                Answer with exactly one word: 'person', 'event', or 'subject'. Query: {query}
                """,
            }
        ],
        model="llama3-8b-8192",
    )
    
    res = chat_completion.choices[0].message.content
    res = res.lower().strip()
    return res

def levenshtein_normalized(str1, str2):
    return 1 - (Levenshtein.distance(str1, str2) / max(len(str1), len(str2)))
    
def find_similar_strings(set1, set2, threshold=0.8):
    set1 = np.array(set1)
    set2 = np.array(set2)
    similarity_matrix = cdist(set1[:, np.newaxis], set2[:, np.newaxis], metric= levenshtein_normalized)

    matches = np.any(similarity_matrix >= threshold, axis=1)

    similar_strings = set1[matches].tolist()
    
    return similar_strings

def get_summary(text, category, query):
    client = Groq(
        api_key="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",
    )

    chat_completion = client.chat.completions.create(
        messages=[
                {
                    "role": "user",
                    "content": f"""
                    Get the following information from the text regarding {query}:
                    - Notable topics, events, or people mentioned in the text
                    (If not mentioned then leave empty)
                    And return the answer strictly in the following format. Do not return anything else:
                    ANSWER START
                    Notable People: List of people separated by commas
                    Notable Events: List of events separated by commas
                    Notable Works: List of works separated by commas
                    Others: List of anything else notable separated by commas
                    ANSWER END
                    Text: {text}
                    """,
                }
            ],
            model="llama3-8b-8192",
    )

    res = chat_completion.choices[0].message.content
    return res

def get_relevant_pages(page, category):
    
    res = get_summary(page.summary, category, page.title)

    pattern = r"ANSWER START(.*?)ANSWER END"
    
    
    match = re.search(pattern, res, re.DOTALL)  
    
    if match:
        
        answers = match.group(1).strip().splitlines() 
        ans_dict = {}
        for ans in answers:
            ans_split = ans.split(": ")
            values = []
            if len(ans_split) == 2:
                values = ans_split[1].split(",")
                values = [value.strip() for value in values]
                links = page.links
                values = find_similar_strings(list(links.keys()), values)
            ans_dict[ans_split[0].title()] = values
                
        return ans_dict
    else:
        return None
"""
def get_relevant_subreddits(query, limit=5):
    relevant_subs = reddit.subreddits.search(query)
    subreddits = {}
    i = 0
    for sub in relevant_subs:
        if i < 5:
            if not sub.over18:
                subreddits[sub.display_name] = f"https://www.reddit.com/r/{sub.display_name}"
                i+=1
        else:
            break
    return subreddits
"""
def get_info(query, display=False):
    

    category = get_type(query)
    wiki = search_wikipedia(query)[0]
    

    title = wiki["title"]

    pageid = wiki["pageid"]

    
    images = get_wikipedia_images(pageid, None)

    page = get_page(title)
    links = get_relevant_pages(page, category)
    """
    links_dict = {}
    
    for key, value in links.items():
        link_dict = {}
        for link in value:
            link_infobox = get_infobox(link)
            if image in link_infobox:
                link_dict[link] = link_infobox["image"]["url"]
            else:
                link_dict[link] = ""
        links_dict[key] = link_dict
    """
    page_dict = {
        'title': page.title,
        'summary': page.summary,
        'links_dict': links,
        'links': [item for sublist in links.values() for item in sublist],
        'sections': [{'title': section.title, 'text': section.text} for section in page.sections 
                     if section.text != "" and section.title not in ["See also","External links"]],
    }
    
    if category == "person":
        infobox = get_infobox(title, images[0])
    else:
        infobox = {}

    #reddits = get_relevant_subreddits(title.replace("_"," "))
    ### --- Test Display --- ###
    if display == True:
        display(Image(infobox["image"]["url"]))
        print(infobox["image"]["caption"])
        if category == "person":
            if "death_date" in infobox:
                print(f"{infobox['birth_date']} - {infobox['birth_date']}")
            else:
                print(f"{infobox['birth_date']} - now")
            other_info = list(infobox.keys() - set(["birth_date,death_date","image"]))
            for info in other_info:
                print(f"{info.replace('_',' ')}: {infobox[info].replace('|',',')}")
        print(page.summary)
        for image in images:
            display(Image(url=image["url"]))
            print(image["caption"])

    info_dict = {"category":category, "title":title, "pageid":pageid, "page":page_dict, "images": images, "infobox": infobox}
    return info_dict