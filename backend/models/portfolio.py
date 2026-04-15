from mongoengine import Document, StringField, ListField, DictField

class Portfolio(Document):
    clerk_id = StringField(required=True, unique=True) 
    email = StringField()      
    username = StringField()   
    
    template = StringField(default="The Minimalist")
    primaryColor = StringField()
    secondaryColor = StringField()
    about = DictField()
    projects = ListField(DictField())
    involvement = DictField()
    githubSync = DictField()